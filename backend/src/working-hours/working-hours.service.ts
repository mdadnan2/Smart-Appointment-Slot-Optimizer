import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateWorkingHourDto, UpdateWorkingHourDto } from './working-hours.dto';

@Injectable()
export class WorkingHoursService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateWorkingHourDto) {
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
    return this.prisma.workingHour.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.workingHour.delete({
      where: { id },
    });
  }
}
