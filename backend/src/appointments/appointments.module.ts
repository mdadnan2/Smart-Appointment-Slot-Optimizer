import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SlotEngineModule } from '../slot-engine/slot-engine.module';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';

@Module({
  imports: [SlotEngineModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService, PrismaService],
})
export class AppointmentsModule {}
