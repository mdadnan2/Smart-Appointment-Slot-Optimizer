import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SlotEngineService } from '../slot-engine/slot-engine.service';
import { IsString, IsOptional } from 'class-validator';

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

@Injectable()
export class AppointmentsService {
  constructor(
    private prisma: PrismaService,
    private slotEngine: SlotEngineService,
  ) {}

  async create(dto: CreateAppointmentDto) {
    console.log('Creating appointment with:', dto);
    
    if (!dto.providerId || !dto.userId || !dto.serviceId) {
      throw new BadRequestException('Missing required fields');
    }

    const startTime = new Date(dto.startTime);
    const endTime = new Date(dto.endTime);

    // Use transaction to prevent race conditions
    return this.prisma.$transaction(async (tx) => {
      // Check for overlapping appointments
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
      });

      if (overlapping) {
        throw new ConflictException('Time slot already booked');
      }

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
        include: {
          provider: {
            include: {
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
              name: true,
              email: true,
              phone: true,
            },
          },
          service: true,
        },
      });
    });
  }

  async findAll(filters?: { providerId?: string; userId?: string; status?: string }) {
    const where: any = {};
    if (filters?.providerId) where.providerId = filters.providerId;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.appointment.findMany({
      where,
      include: {
        provider: {
          include: {
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
            name: true,
            email: true,
            phone: true,
          },
        },
        service: true,
      },
      orderBy: { startTime: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.appointment.findUnique({
      where: { id },
      include: {
        provider: {
          include: {
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
            name: true,
            email: true,
            phone: true,
          },
        },
        service: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.appointment.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async cancel(id: string) {
    return this.updateStatus(id, 'CANCELLED');
  }
}
