import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateHolidayDto } from './holidays.dto';

@Injectable()
export class HolidaysService {
  constructor(private prisma: PrismaService) {}

  async create(createHolidayDto: CreateHolidayDto) {
    return this.prisma.holiday.create({
      data: {
        providerId: createHolidayDto.providerId,
        title: createHolidayDto.title,
        date: new Date(createHolidayDto.date),
        isRecurring: createHolidayDto.isRecurring || false,
      },
    });
  }

  async findAll(providerId: string) {
    return this.prisma.holiday.findMany({
      where: { providerId },
      orderBy: { date: 'asc' },
    });
  }

  async remove(id: string) {
    return this.prisma.holiday.delete({
      where: { id },
    });
  }
}
