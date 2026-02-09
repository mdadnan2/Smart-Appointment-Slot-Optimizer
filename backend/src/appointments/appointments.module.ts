import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../common/prisma.service';
import { SlotEngineModule } from '../slot-engine/slot-engine.module';

@Module({
  imports: [SlotEngineModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PrismaService],
})
export class AppointmentsModule {}
