import { Module } from '@nestjs/common';
import { BreaksController } from './breaks.controller';
import { BreaksService } from './breaks.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  controllers: [BreaksController],
  providers: [BreaksService, PrismaService],
})
export class BreaksModule {}
