import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateWorkingHourDto, UpdateWorkingHourDto } from './working-hours.dto';

@Injectable()
export class WorkingHoursService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkingHourDto) {
    // Check if shift already exists for this day and shift type
    const existingShift = await this.prisma.workingHour.findFirst({
      where: {
        providerId: dto.providerId,
        dayOfWeek: dto.dayOfWeek as any,
        shiftType: dto.shiftType as any,
        isActive: true,
      },
    });

    if (existingShift) {
      throw new ConflictException(
        `A ${dto.shiftType} shift already exists for ${dto.dayOfWeek}. Please edit the existing shift or delete it first.`
      );
    }

    return this.prisma.workingHour.create({
      data: {
        providerId: dto.providerId,
        dayOfWeek: dto.dayOfWeek as any,
        shiftType: dto.shiftType as any,
        startTime: dto.startTime,
        endTime: dto.endTime,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.workingHour.findMany({
      where: { providerId },
      orderBy: { dayOfWeek: 'asc' },
    });
  }

  async update(id: string, dto: UpdateWorkingHourDto) {
    // If updating day or shift type, check for conflicts
    if (dto.dayOfWeek || dto.shiftType) {
      const currentShift = await this.prisma.workingHour.findUnique({
        where: { id },
      });

      if (!currentShift) {
        throw new ConflictException('Shift not found');
      }

      const existingShift = await this.prisma.workingHour.findFirst({
        where: {
          providerId: currentShift.providerId,
          dayOfWeek: (dto.dayOfWeek || currentShift.dayOfWeek) as any,
          shiftType: (dto.shiftType || currentShift.shiftType) as any,
          isActive: true,
          id: { not: id },
        },
      });

      if (existingShift) {
        throw new ConflictException(
          `A ${dto.shiftType || currentShift.shiftType} shift already exists for ${dto.dayOfWeek || currentShift.dayOfWeek}. Please choose a different day or shift type.`
        );
      }
    }

    const updateData: any = {};
    if (dto.dayOfWeek) updateData.dayOfWeek = dto.dayOfWeek;
    if (dto.shiftType) updateData.shiftType = dto.shiftType;
    if (dto.startTime) updateData.startTime = dto.startTime;
    if (dto.endTime) updateData.endTime = dto.endTime;
    if (dto.isActive !== undefined) updateData.isActive = dto.isActive;

    return this.prisma.workingHour.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string) {
    return this.prisma.workingHour.delete({
      where: { id },
    });
  }
}
