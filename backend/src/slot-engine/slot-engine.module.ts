import { Module } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { SlotEngineController } from './slot-engine.controller';
import { SlotEngineService } from './slot-engine.service';

@Module({
  controllers: [SlotEngineController],
  providers: [SlotEngineService, PrismaService],
  exports: [SlotEngineService],
})
export class SlotEngineModule {}
