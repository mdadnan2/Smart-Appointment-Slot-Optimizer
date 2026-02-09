import { Controller, Get, Post, Body, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { BreaksService, CreateBreakDto } from './breaks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('breaks')
@UseGuards(JwtAuthGuard)
export class BreaksController {
  constructor(private breaksService: BreaksService) {}

  @Post()
  create(@Body() dto: CreateBreakDto) {
    return this.breaksService.create(dto);
  }

  @Get()
  findByProvider(@Query('providerId') providerId: string) {
    return this.breaksService.findByProvider(providerId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.breaksService.remove(id);
  }
}
