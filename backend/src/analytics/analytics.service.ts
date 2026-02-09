import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(providerId: string) {
    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // Total patients (unique users with appointments)
    const totalPatients = await this.prisma.appointment.groupBy({
      by: ['userId'],
      where: {
        providerId,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
    });

    // Calculate new vs old patients
    const patientAppointmentCounts = await this.prisma.appointment.groupBy({
      by: ['userId'],
      where: {
        providerId,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      _count: {
        id: true,
      },
    });

    const newPatients = patientAppointmentCounts.filter(p => p._count.id === 1).length;
    const oldPatients = patientAppointmentCounts.filter(p => p._count.id > 1).length;

    // Today's patients
    const todayPatients = await this.prisma.appointment.count({
      where: {
        providerId,
        startTime: { gte: todayStart, lte: todayEnd },
        status: { in: ['CONFIRMED', 'COMPLETED', 'PENDING'] },
      },
    });

    // Today's appointments
    const todayAppointments = await this.prisma.appointment.findMany({
      where: {
        providerId,
        startTime: { gte: todayStart, lte: todayEnd },
      },
      include: {
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
    });

    // Monthly stats
    const monthlyAppointments = await this.prisma.appointment.findMany({
      where: {
        providerId,
        startTime: { gte: monthStart, lte: monthEnd },
      },
      select: {
        status: true,
        startTime: true,
      },
    });

    // Status distribution
    const statusDistribution = await this.prisma.appointment.groupBy({
      by: ['status'],
      where: {
        providerId,
        startTime: { gte: monthStart, lte: monthEnd },
      },
      _count: true,
    });

    return {
      totalPatients: totalPatients.length,
      newPatients,
      oldPatients,
      todayPatients,
      todayAppointments: todayAppointments.length,
      todayAppointmentsList: todayAppointments,
      monthlyStats: {
        total: monthlyAppointments.length,
        byStatus: statusDistribution.map((s) => ({
          status: s.status,
          count: s._count,
        })),
      },
    };
  }

  async getMonthlyTrend(providerId: string, year: number, month: number) {
    const start = new Date(year, month - 1, 1);
    const end = endOfMonth(start);

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
