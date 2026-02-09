'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { format } from 'date-fns';
import StatsCard from '@/components/dashboard/StatsCard';
import PatientsSummary from '@/components/dashboard/PatientsSummary';
import TodayAppointment from '@/components/dashboard/TodayAppointment';
import AppointmentRequest from '@/components/dashboard/AppointmentRequest';
import Calendar from '@/components/dashboard/Calendar';

export default function Dashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'ADMIN') {
      router.push('/patient-dashboard');
      return;
    }
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const providerId = localStorage.getItem('providerId');
      const { data } = await api.get(`/analytics/dashboard?providerId=${providerId}`);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <main className="p-4 sm:p-6 animate-fade-in overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 pr-14 lg:pr-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <StatsCard
            title="Total Patient"
            value={stats?.totalPatients || 0}
            subtitle="Till Today"
            icon="users"
          />
          <StatsCard
            title="Today Patient"
            value={stats?.todayPatients || 0}
            subtitle={format(new Date(), 'dd MMM yyyy')}
            icon="user-check"
          />
          <StatsCard
            title="Today Appointments"
            value={stats?.todayAppointments || 0}
            subtitle={format(new Date(), 'dd MMM yyyy')}
            icon="clock"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <PatientsSummary stats={stats} />
          <TodayAppointment appointments={stats?.todayAppointmentsList || []} />
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AppointmentRequest />
          <Calendar />
        </div>
        </main>
  );
}
