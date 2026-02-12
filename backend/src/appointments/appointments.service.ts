import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../common/prisma.service';
import { SlotEngineService } from '../slot-engine/slot-engine.service';

export class CreateAppointmentDto {
  @IsString()
  providerId: string;

  @IsString()
  userId: string;

  @IsString()
  serviceId: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

// ✅ OPTIMIZATION: Reusable select object to avoid duplication
const APPOINTMENT_SELECT = {
  id: true,
  startTime: true,
  endTime: true,
  status: true,
  notes: true,
  createdAt: true,
  provider: {
    select: {
      id: true,
      specialty: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    },
  },
  service: {
    select: {
      id: true,
      name: true,
      duration: true,
      price: true,
    },
  },
};

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private slotEngine: SlotEngineService,
  ) {}

  /**
   * ✅ OPTIMIZED: Removed console.log, improved transaction efficiency
   */
  async create(dto: CreateAppointmentDto) {
    if (!dto.providerId || !dto.userId || !dto.serviceId) {
      throw new BadRequestException('Missing required fields');
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // ✅ OPTIMIZATION: Use transaction with minimal scope
    return this.prisma.$transaction(async (tx) => {
      // ✅ OPTIMIZATION: Simplified overlap check query
      const overlapping = await tx.appointment.findFirst({
        where: {
          providerId: dto.providerId,
          status: { in: ['PENDING', 'CONFIRMED'] },
          OR: [
            {
              AND: [
                { startTime: { lte: startTime } },
                { endTime: { gt: startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: startTime } },
                { endTime: { lte: endTime } },
              ],
            },
          ],
        },
        select: { id: true }, // ✅ Only select ID for existence check
      });

      if (overlapping) {
        throw new ConflictException('Time slot already booked');
      }

      // ✅ OPTIMIZATION: Use predefined select object
      return tx.appointment.create({
        data: {
          providerId: dto.providerId,
          userId: dto.userId,
          serviceId: dto.serviceId,
          startTime,
          endTime,
          notes: dto.notes,
          status: 'PENDING',
        },
        select: APPOINTMENT_SELECT,
      });
    });
  }

  /**
   * ✅ OPTIMIZED: Use select instead of include, added pagination support
   */
  async findAll(filters?: { 
    providerId?: string; 
    userId?: string; 
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: any = {};
    if (filters?.providerId) where.providerId = filters.providerId;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status) where.status = filters.status;

    // ✅ OPTIMIZATION: Added pagination
    const limit = filters?.limit || 100;
    const offset = filters?.offset || 0;

    return this.prisma.appointment.findMany({
      where,
      select: APPOINTMENT_SELECT,
      orderBy: { startTime: 'desc' },
      take: limit,
      skip: offset,
    });
  }

  /**
   * ✅ OPTIMIZED: Use select instead of include
   */
  async findOne(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      select: APPOINTMENT_SELECT,
    });
  }

  /**
   * ✅ OPTIMIZED: Only update and return necessary fields
   */
  async updateStatus(id: string, status: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
      select: {
        id: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async cancel(id: string) {
    return this.updateStatus(id, 'CANCELLED');
  }
}
