import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { DayOfWeek } from '@prisma/client';
import { 
  startOfDay, 
  endOfDay, 
  addMinutes, 
  isBefore, 
  isAfter,
  isWithinInterval,
  getDay
} from 'date-fns';

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
   * ✅ OPTIMIZED: Generate available slots with minimal database queries
   * Reduced from 4-5 queries to 1 single optimized query
   */
  async generateAvailableSlots(
    providerId: string,
    date: Date,
    serviceDuration: number,
  ): Promise<TimeSlot[]> {
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    const dayOfWeek = this.getDayOfWeekEnum(date);

    // ✅ OPTIMIZATION: Single query fetches ALL required data
    const providerData = await this.prisma.provider.findUnique({
      where: { id: providerId },
      select: {
        timezone: true,
        workingHours: {
          where: {
            dayOfWeek,
            isActive: true,
          },
          select: {
            startTime: true,
            endTime: true,
          },
        },
        holidays: {
          where: {
            date: dayStart,
          },
          select: {
            id: true,
          },
        },
        breaks: {
          where: {
            startTime: {
              gte: dayStart,
              lte: dayEnd,
            },
          },
          select: {
            startTime: true,
            endTime: true,
          },
        },
        appointments: {
          where: {
            startTime: {
              gte: dayStart,
              lte: dayEnd,
            },
            status: {
              in: ['PENDING', 'CONFIRMED'],
            },
          },
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    if (!providerData) {
      throw new Error('Provider not found');
    }

    // Check if date is a holiday
    if (providerData.holidays.length > 0) {
      return [];
    }

    // Check if working hours exist
    if (providerData.workingHours.length === 0) {
      return [];
    }

    // Create working intervals from all shifts
    const workingIntervals: TimeInterval[] = providerData.workingHours.map(wh => 
      this.createWorkingInterval(date, wh.startTime, wh.endTime)
    );

    // Convert breaks to intervals
    const breakIntervals: TimeInterval[] = providerData.breaks.map(b => ({
      start: b.startTime,
      end: b.endTime,
    }));

    // Convert appointments to intervals
    const appointmentIntervals: TimeInterval[] = providerData.appointments.map(a => ({
      start: a.startTime,
      end: a.endTime,
    }));

    // Subtract breaks and appointments from working intervals
    let availableIntervals = this.subtractIntervals(workingIntervals, breakIntervals);
    availableIntervals = this.subtractIntervals(availableIntervals, appointmentIntervals);

    // Generate slots from available intervals
    let slots = this.generateSlotsFromIntervals(availableIntervals, serviceDuration);

    // Filter out past slots for today
    const now = new Date();
    if (dayStart.getTime() === startOfDay(now).getTime()) {
      slots = slots.filter(slot => new Date(slot.startTime) > now);
    }

    return slots;
  }

  /**
   * ✅ OPTIMIZED: Simplified interval creation
   */
  private createWorkingInterval(
    date: Date,
    startTime: string,
    endTime: string,
  ): TimeInterval {
    const startParts = startTime.split(':').map(Number);
    const endParts = endTime.split(':').map(Number);

    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startParts[0], startParts[1] || 0, 0, 0);
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endParts[0], endParts[1] || 0, 0, 0);

    return { start, end };
  }

  /**
   * ✅ OPTIMIZED: Subtract blocked intervals from available intervals
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
          continue;
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
   * ✅ OPTIMIZED: Generate time slots from available intervals
   */
  private generateSlotsFromIntervals(
    intervals: TimeInterval[],
    duration: number,
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];

    for (const interval of intervals) {
      let current = interval.start;

      while (isBefore(current, interval.end)) {
        const slotEnd = addMinutes(current, duration);

        if (isAfter(slotEnd, interval.end)) {
          break;
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
   * ✅ OPTIMIZED: Check if a specific slot is available
   * Reuses the optimized generateAvailableSlots method
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
