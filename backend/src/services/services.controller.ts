import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ServicesService, CreateServiceDto } from './services.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('services')
@UseGuards(JwtAuthGuard)
export class ServicesController {
  constructor(private servicesService: ServicesService) {}

  @Post()
  create(@Body() dto: CreateServiceDto) {
    return this.servicesService.create(dto);
  }

  @Get()
  findByProvider(@Query('providerId') providerId: string) {
    return this.servicesService.findByProvider(providerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<CreateServiceDto>) {
    return this.servicesService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
