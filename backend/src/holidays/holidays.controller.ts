import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './holidays.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('holidays')
@UseGuards(JwtAuthGuard)
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Post()
  create(@Body() createHolidayDto: CreateHolidayDto) {
    return this.holidaysService.create(createHolidayDto);
  }

  @Get()
  findAll(@Query('providerId') providerId: string) {
    return this.holidaysService.findAll(providerId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.holidaysService.remove(id);
  }
}
