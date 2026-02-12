import { Injectable } from '@nestjs/common';
import { endOfDay, endOfMonth, startOfDay, startOfMonth } from 'date-fns';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  /**
   * ✅ OPTIMIZED: Reduced queries and improved performance
   * Before: 6+ separate queries
   * After: 3 optimized queries with aggregations
   */
  async getDashboardStats(providerId: string) {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // ✅ OPTIMIZATION: Parallel query execution
    const [patientStats, todayAppointments, monthlyStats] = await Promise.all([
      // Query 1: Patient statistics (total, new, old)
      this.prisma.appointment.groupBy({
        by: ['userId'],
        where: {
          providerId,
          status: { in: ['CONFIRMED', 'COMPLETED'] },
        },
        _count: {
          id: true,
        },
      }),

      // Query 2: Today's appointments with minimal data
      this.prisma.appointment.findMany({
        where: {
          providerId,
          startTime: { gte: todayStart, lte: todayEnd },
        },
        select: {
          id: true,
          startTime: true,
          endTime: true,
          status: true,
          user: {
            select: {
              name: true,
              email: true,
            },
          },
          service: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { startTime: 'asc' },
      }),

      // Query 3: Monthly statistics with status distribution
      this.prisma.appointment.groupBy({
        by: ['status'],
        where: {
          providerId,
          startTime: { gte: monthStart, lte: monthEnd },
        },
        _count: {
          status: true,
        },
      }),
    ]);

    // ✅ OPTIMIZATION: Calculate stats from single query result
    const totalPatients = patientStats.length;
    const newPatients = patientStats.filter(p => p._count.id === 1).length;
    const oldPatients = patientStats.filter(p => p._count.id > 1).length;

    // ✅ OPTIMIZATION: Filter today's patients from already fetched data
    const todayPatients = todayAppointments.filter(
      apt => ['CONFIRMED', 'COMPLETED', 'PENDING'].includes(apt.status)
    ).length;

    // ✅ OPTIMIZATION: Calculate monthly total from aggregated data
    const monthlyTotal = monthlyStats.reduce((sum, s) => sum + s._count.status, 0);

    return {
      totalPatients,
      newPatients,
      oldPatients,
      todayPatients,
      todayAppointments: todayAppointments.length,
      todayAppointmentsList: todayAppointments,
      monthlyStats: {
        total: monthlyTotal,
        byStatus: monthlyStats.map((s) => ({
          status: s.status,
          count: s._count.status,
        })),
      },
    };
  }

  /**
   * ✅ OPTIMIZED: Simplified monthly trend calculation
   */
  async getMonthlyTrend(providerId: string, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = endOfMonth(start);

    // ✅ OPTIMIZATION: Only fetch required fields
    const appointments = await this.prisma.appointment.findMany({
      where: {
        providerId,
        startTime: { gte: start, lte: end },
      },
      select: {
        startTime: true,
        status: true,
      },
    });

    // Group by day
    const dailyStats = appointments.reduce((acc, apt) => {
      const day = apt.startTime.getDate();
      if (!acc[day]) {
        acc[day] = { total: 0, completed: 0, cancelled: 0 };
      }
      acc[day].total++;
      if (apt.status === 'COMPLETED') acc[day].completed++;
      if (apt.status === 'CANCELLED') acc[day].cancelled++;
      return acc;
    }, {} as Record<number, any>);

    return dailyStats;
  }
}
