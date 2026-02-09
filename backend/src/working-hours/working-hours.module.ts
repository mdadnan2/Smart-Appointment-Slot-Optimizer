import { Module } from '@nestjs/common';
import { WorkingHoursController } from './working-hours.controller';
import { WorkingHoursService } from './working-hours.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [WorkingHoursController],
  providers: [WorkingHoursService, PrismaService],
})
export class WorkingHoursModule {}
