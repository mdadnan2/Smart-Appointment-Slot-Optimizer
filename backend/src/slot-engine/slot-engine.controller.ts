import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SlotEngineService } from './slot-engine.service';
import { GetSlotsDto } from './slot-engine.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('slots')
@UseGuards(JwtAuthGuard)
export class SlotEngineController {
  constructor(private slotEngineService: SlotEngineService) {}

  @Get()
  async getAvailableSlots(
    @Query('providerId') providerId: string,
    @Query('date') date: string,
    @Query('duration') duration: string,
  ) {
    if (!providerId || !date || !duration) {
      throw new Error('Missing required parameters: providerId, date, duration');
    }

    console.log('Slot request:', { providerId, date, duration });
    
    const parsedDate = new Date(date);
    const parsedDuration = parseInt(duration, 10);
    
    const slots = await this.slotEngineService.generateAvailableSlots(
      providerId,
      parsedDate,
      parsedDuration,
    );

    return {
      providerId,
      date,
      duration: parsedDuration,
      slots,
      count: slots.length,
    };
  }
}
