import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { CreateProviderDto, UpdateProviderDto } from './providers.dto';

@Injectable()
export class ProvidersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateProviderDto) {
    return this.prisma.provider.create({
      data: {
        userId: dto.userId,
        specialty: dto.specialty,
        timezone: dto.timezone || 'UTC',
        defaultServiceDuration: dto.defaultServiceDuration || 30,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.provider.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
          },
        },
        workingHours: true,
        services: true,
      },
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    return provider;
  }

  async update(id: string, dto: UpdateProviderDto) {
    return this.prisma.provider.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.provider.delete({
      where: { id },
    });
  }
}
