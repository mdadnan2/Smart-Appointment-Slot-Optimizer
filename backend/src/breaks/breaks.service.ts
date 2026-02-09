import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';

export class CreateBreakDto {
  providerId: string;
  title: string;
  startTime: string;
  endTime: string;
  isRecurring?: boolean;
}

@Injectable()
export class BreaksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBreakDto) {
    return this.prisma.break.create({
      data: {
        providerId: dto.providerId,
        title: dto.title,
        startTime: new Date(dto.startTime),
        endTime: new Date(dto.endTime),
        isRecurring: dto.isRecurring || false,
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.break.findMany({
      where: { providerId },
      orderBy: { startTime: 'asc' },
    });
  }

  async remove(id: string) {
    return this.prisma.break.delete({
      where: { id },
    });
  }
}
