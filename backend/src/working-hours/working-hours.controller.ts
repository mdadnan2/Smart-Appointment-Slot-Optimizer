import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { WorkingHoursService } from './working-hours.service';
import { CreateWorkingHourDto, UpdateWorkingHourDto } from './working-hours.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('working-hours')
@UseGuards(JwtAuthGuard)
export class WorkingHoursController {
  constructor(private workingHoursService: WorkingHoursService) {}

  @Post()
  create(@Body() dto: CreateWorkingHourDto) {
    return this.workingHoursService.create(dto);
  }

  @Get()
  findByProvider(@Query('providerId') providerId: string) {
    return this.workingHoursService.findByProvider(providerId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkingHourDto) {
    return this.workingHoursService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workingHoursService.remove(id);
  }
}
