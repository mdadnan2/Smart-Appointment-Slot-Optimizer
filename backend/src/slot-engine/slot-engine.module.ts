import { Module } from '@nestjs/common';
import { SlotEngineController } from './slot-engine.controller';
import { SlotEngineService } from './slot-engine.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [SlotEngineController],
  providers: [SlotEngineService, PrismaService],
  exports: [SlotEngineService],
})
export class SlotEngineModule {}
