import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { DayOfWeek } from '@prisma/client';
import { 
  startOfDay, 
  endOfDay, 
  addMinutes, 
  parseISO, 
  format, 
  isBefore, 
  isAfter,
  isWithinInterval,
  getDay
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface TimeInterval {
  start: Date;
  end: Date;
}

@Injectable()
export class SlotEngineService {
  constructor(private prisma: PrismaService) {}

  /**
   * CORE ALGORITHM: Generate available slots dynamically
   * No slots are stored in database
   */
  async generateAvailableSlots(
    providerId: string,
    date: Date,
    serviceDuration: number,
  ): Promise<TimeSlot[]> {
    // Step 1: Get provider's timezone
    const provider = await this.prisma.provider.findUnique({
      where: { id: providerId },
    });

    if (!provider) {
      throw new Error('Provider not found');
    }

    const timezone = provider.timezone;

    // Step 2: Check if date is a holiday
    const isHoliday = await this.checkIfHoliday(providerId, date);
    if (isHoliday) {
      return []; // No slots on holidays
    }

    // Step 3: Get working hours for the specific day
    const dayOfWeek = this.getDayOfWeekEnum(date);
    const workingHours = await this.prisma.workingHour.findMany({
      where: {
        providerId,
        dayOfWeek,
        isActive: true,
      },
    });

    if (!workingHours || workingHours.length === 0) {
      return []; // No working hours configured for this day
    }

    // Step 4: Create working intervals from all shifts
    let workingIntervals: TimeInterval[] = [];
    for (const workingHour of workingHours) {
      const intervals = this.createWorkingIntervals(
        date,
        workingHour.startTime,
        workingHour.endTime,
        timezone,
      );
      workingIntervals = [...workingIntervals, ...intervals];
    }

    // Step 5: Get all breaks for the day
    const breaks = await this.getBreaksForDay(providerId, date);

    // Step 6: Get all booked appointments for the day
    const appointments = await this.getAppointmentsForDay(providerId, date);

    // Step 7: Remove breaks from working intervals
    let availableIntervals = this.subtractIntervals(workingIntervals, breaks);

    // Step 8: Remove booked appointments from available intervals
    availableIntervals = this.subtractIntervals(availableIntervals, appointments);

    // Step 9: Generate slots from available intervals
    let slots = this.generateSlotsFromIntervals(
      availableIntervals,
      serviceDuration,
      timezone,
    );

    // Step 10: Filter out past slots for today
    const now = new Date();
    const isToday = startOfDay(date).getTime() === startOfDay(now).getTime();
    if (isToday) {
      slots = slots.filter(slot => new Date(slot.startTime) > now);
    }

    return slots;
  }

  /**
   * Check if a date is a holiday
   */
  private async checkIfHoliday(providerId: string, date: Date): Promise<boolean> {
    const dayStart = startOfDay(date);
    const holiday = await this.prisma.holiday.findFirst({
      where: {
        providerId,
        date: dayStart,
      },
    });
    return !!holiday;
  }

  /**
   * Create working time intervals for a specific day
   */
  private createWorkingIntervals(
    date: Date,
    startTime: string,
    endTime: string,
    timezone: string,
  ): TimeInterval[] {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const start = new Date(date);
    start.setHours(startHour, startMinute, 0, 0);

    const end = new Date(date);
    end.setHours(endHour, endMinute, 0, 0);

    return [{ start, end }];
  }

  /**
   * Get all breaks for a specific day
   */
  private async getBreaksForDay(
    providerId: string,
    date: Date,
  ): Promise<TimeInterval[]> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const breaks = await this.prisma.break.findMany({
      where: {
        providerId,
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
    });

    return breaks.map((b) => ({
      start: b.startTime,
      end: b.endTime,
    }));
  }

  /**
   * Get all confirmed appointments for a specific day
   */
  private async getAppointmentsForDay(
    providerId: string,
    date: Date,
  ): Promise<TimeInterval[]> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        providerId,
        startTime: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
      },
    });

    return appointments.map((a) => ({
      start: a.startTime,
      end: a.endTime,
    }));
  }

  /**
   * Subtract blocked intervals from available intervals
   */
  private subtractIntervals(
    available: TimeInterval[],
    blocked: TimeInterval[],
  ): TimeInterval[] {
    let result = [...available];

    for (const block of blocked) {
      const newResult: TimeInterval[] = [];

      for (const interval of result) {
        // No overlap
        if (isAfter(block.start, interval.end) || isBefore(block.end, interval.start)) {
          newResult.push(interval);
          continue;
        }

        // Block completely covers interval
        if (
          isBefore(block.start, interval.start) &&
          isAfter(block.end, interval.end)
        ) {
          continue; // Skip this interval
        }

        // Block is at the start
        if (
          isBefore(block.start, interval.start) &&
          isWithinInterval(block.end, { start: interval.start, end: interval.end })
        ) {
          newResult.push({ start: block.end, end: interval.end });
          continue;
        }

        // Block is at the end
        if (
          isWithinInterval(block.start, { start: interval.start, end: interval.end }) &&
          isAfter(block.end, interval.end)
        ) {
          newResult.push({ start: interval.start, end: block.start });
          continue;
        }

        // Block is in the middle
        if (
          isWithinInterval(block.start, { start: interval.start, end: interval.end }) &&
          isWithinInterval(block.end, { start: interval.start, end: interval.end })
        ) {
          newResult.push({ start: interval.start, end: block.start });
          newResult.push({ start: block.end, end: interval.end });
        }
      }

      result = newResult;
    }

    return result;
  }

  /**
   * Generate time slots from available intervals
   */
  private generateSlotsFromIntervals(
    intervals: TimeInterval[],
    duration: number,
    timezone: string,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];

    for (const interval of intervals) {
      let current = interval.start;

      while (isBefore(current, interval.end)) {
        const slotEnd = addMinutes(current, duration);

        if (isAfter(slotEnd, interval.end)) {
          break; // Slot doesn't fit
        }

        slots.push({
          startTime: current.toISOString(),
          endTime: slotEnd.toISOString(),
        });

        current = slotEnd;
      }
    }

    return slots;
  }

  /**
   * Convert JavaScript day to Prisma enum
   */
  private getDayOfWeekEnum(date: Date): DayOfWeek {
    const days = [
      DayOfWeek.SUNDAY,
      DayOfWeek.MONDAY,
      DayOfWeek.TUESDAY,
      DayOfWeek.WEDNESDAY,
      DayOfWeek.THURSDAY,
      DayOfWeek.FRIDAY,
      DayOfWeek.SATURDAY,
    ];
    return days[getDay(date)];
  }

  /**
   * Check if a specific slot is available
   */
  async isSlotAvailable(
    providerId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const date = startOfDay(startTime);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    const availableSlots = await this.generateAvailableSlots(
      providerId,
      date,
      duration,
    );

    return availableSlots.some(
      (slot) =>
        new Date(slot.startTime).getTime() === startTime.getTime() &&
        new Date(slot.endTime).getTime() === endTime.getTime(),
    );
  }
}
