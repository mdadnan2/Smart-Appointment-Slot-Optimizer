import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;
}

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateServiceDto) {
    return this.prisma.service.create({
      data: {
        providerId: dto.providerId,
        name: dto.name,
        duration: Number(dto.duration),
        price: dto.price ? Number(dto.price) : undefined,
        description: dto.description || undefined,
      },
    });
  }

  async findByProvider(providerId: string) {
    return this.prisma.service.findMany({
      where: { providerId, isActive: true },
    });
  }

  async update(id: string, data: Partial<CreateServiceDto>) {
    return this.prisma.service.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
