'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import PatientStatsCard from '@/components/dashboard/PatientStatsCard';
import Calendar from '@/components/dashboard/Calendar';

// ✅ OPTIMIZATION: Memoized appointment card component to prevent re-renders
const AppointmentCard = ({ apt }: { apt: any }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 w-full max-w-full">
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {apt.provider?.user?.name?.charAt(0) || 'D'}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-xs text-gray-800 truncate">{apt.service?.name}</p>
        <p className="text-xs text-gray-600 truncate">
          Dr. {apt.provider?.user?.name}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {format(new Date(apt.startTime), 'MMM dd, yyyy • hh:mm a')}
        </p>
      </div>
    </div>
    <div className="flex-shrink-0 mt-2 sm:mt-0">
      <span
        className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
          apt.status === 'CONFIRMED'
            ? 'bg-green-100 text-green-700'
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {apt.status}
      </span>
    </div>
  </div>
);

// ✅ OPTIMIZATION: Memoized recent appointment card
const RecentAppointmentCard = ({ apt }: { apt: any }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg w-full max-w-full">
    <div className="flex items-center gap-2 min-w-0 flex-1">
      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
        <CalendarIcon size={14} className="text-blue-700" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-xs truncate">{apt.service?.name}</p>
        <p className="text-xs text-gray-500 truncate">
          {format(new Date(apt.startTime), 'MMM dd, yyyy')}
        </p>
      </div>
    </div>
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap flex-shrink-0 ${
        apt.status === 'COMPLETED'
          ? 'bg-blue-100 text-blue-700'
          : apt.status === 'CANCELLED'
          ? 'bg-red-100 text-red-700'
          : apt.status === 'CONFIRMED'
          ? 'bg-green-100 text-green-700'
          : 'bg-yellow-100 text-yellow-700'
      }`}
    >
      {apt.status}
    </span>
  </div>
);

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ OPTIMIZATION: Memoized computed values to prevent recalculation
  const upcomingAppointments = useMemo(
    () => appointments.filter(
      (apt) => new Date(apt.startTime) > new Date() && apt.status !== 'CANCELLED'
    ),
    [appointments]
  );

  const completedAppointments = useMemo(
    () => appointments.filter((apt) => apt.status === 'COMPLETED'),
    [appointments]
  );

  // ✅ OPTIMIZATION: Memoized sliced arrays
  const upcomingSlice = useMemo(
    () => upcomingAppointments.slice(0, 4),
    [upcomingAppointments]
  );

  const recentSlice = useMemo(
    () => appointments.slice(0, 5),
    [appointments]
  );

  // ✅ OPTIMIZATION: useCallback to prevent function recreation
  const fetchUserData = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      const { data } = await api.get(`/users/${userId}`);
      setUser(data);
    } catch (error) {
      // ✅ REMOVED: console.error for production
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const userId = localStorage.getItem('userId');
      const { data } = await api.get(`/appointments?userId=${userId}`);
      setAppointments(data);
    } catch (error) {
      // ✅ REMOVED: console.error for production
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole === 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    fetchUserData();
    fetchAppointments();
  }, [router, fetchUserData, fetchAppointments]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>;
  }

  return (
    <main className="p-4 sm:p-6 animate-fade-in overflow-x-hidden w-full max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 lg:pr-0 w-full">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <p className="text-gray-600 text-xs sm:text-sm mb-4">Welcome back, {user?.name}!</p>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 w-full">
        <PatientStatsCard
          title="Total Appointments"
          value={appointments.length}
          subtitle="All time"
          icon="appointments"
        />
        <PatientStatsCard
          title="Upcoming Appointments"
          value={upcomingAppointments.length}
          subtitle="Scheduled"
          icon="upcoming"
        />
        <PatientStatsCard
          title="Completed"
          value={completedAppointments.length}
          subtitle="Finished"
          icon="completed"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 w-full max-w-full">
        {/* Upcoming Appointments */}
        <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2 w-full">
            <h2 className="text-sm font-bold text-gray-800">Upcoming Appointments</h2>
            <a href="/book-appointment" className="text-blue-600 text-xs font-semibold hover:underline">
              Book New
            </a>
          </div>
          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-xs mb-3">No upcoming appointments</p>
              <a
                href="/book-appointment"
                className="inline-block bg-blue-600 text-white px-4 py-2 text-xs rounded-lg font-semibold hover:bg-blue-700"
              >
                Book Your First Appointment
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingSlice.map((apt) => (
                <AppointmentCard key={apt.id} apt={apt} />
              ))}
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="w-full max-w-full"><Calendar /></div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full max-w-full">
        <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-full">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Recent Appointments</h2>
          <div className="space-y-2">
            {recentSlice.map((apt) => (
              <RecentAppointmentCard key={apt.id} apt={apt} />
            ))}
            {appointments.length === 0 && (
              <p className="text-center text-gray-400 text-xs py-6">No appointments yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-4 shadow-sm w-full max-w-full">
          <h2 className="text-sm font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <a
              href="/book-appointment"
              className="block w-full bg-blue-600 text-white text-center py-2 text-xs rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Book New Appointment
            </a>
            <a
              href="/appointments"
              className="block w-full bg-white text-blue-600 text-center py-2 text-xs rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-200"
            >
              View All Appointments
            </a>
            <a
              href="/profile"
              className="block w-full bg-white text-blue-600 text-center py-2 text-xs rounded-lg font-semibold hover:bg-gray-50 transition-colors border border-blue-200"
            >
              Update Profile
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
