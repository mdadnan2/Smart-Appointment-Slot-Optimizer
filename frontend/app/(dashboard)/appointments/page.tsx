'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { format, isAfter, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, Clock, User } from 'lucide-react';

export default function Appointments() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role || '');
    fetchUserData();
    fetchAppointments();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const { data } = await api.get(`/users/${userId}`);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const userRole = localStorage.getItem('userRole');
      const userId = localStorage.getItem('userId');
      const providerId = localStorage.getItem('providerId');
      
      let url = '/appointments';
      if (userRole === 'ADMIN' && providerId) {
        url += `?providerId=${providerId}`;
      } else if (userId) {
        url += `?userId=${userId}`;
      }
      
      const { data } = await api.get(url);
      // Sort by startTime descending (most recent first)
      const sorted = data.sort((a: any, b: any) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
      setAppointments(sorted);
    } catch (error) {
      console.error('Failed to fetch appointments', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const isAppointmentPassed = (endTime: string) => {
    return isAfter(new Date(), new Date(endTime));
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    let filtered = appointments;

    switch (filter) {
      case 'today':
        filtered = appointments.filter(apt => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= startOfDay(now) && aptDate <= endOfDay(now);
        });
        break;
      case 'week':
        filtered = appointments.filter(apt => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= startOfWeek(now) && aptDate <= endOfWeek(now);
        });
        break;
      case 'month':
        filtered = appointments.filter(apt => {
          const aptDate = new Date(apt.startTime);
          return aptDate >= startOfMonth(now) && aptDate <= endOfMonth(now);
        });
        break;
      default:
        filtered = appointments;
    }

    return filtered.slice(0, 10);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-sm">Loading...</div>;
  }

  return (
    <main className="min-h-screen p-4 sm:p-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">All Appointments</h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {userRole === 'USER' && (
              <a
                href="/book-appointment"
                className="px-4 py-2.5 lg:py-1.5 text-sm lg:text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold whitespace-nowrap min-h-[44px] lg:min-h-0 flex items-center justify-center"
              >
                Book Appointment
              </a>
            )}
            <button
              onClick={() => setFilter('today')}
              className={`px-4 py-2.5 lg:py-1.5 text-sm lg:text-xs rounded-lg transition whitespace-nowrap min-h-[44px] lg:min-h-0 ${filter === 'today' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Today
            </button>
            <button
              onClick={() => setFilter('week')}
              className={`px-4 py-2.5 lg:py-1.5 text-sm lg:text-xs rounded-lg transition whitespace-nowrap min-h-[44px] lg:min-h-0 ${filter === 'week' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Week
            </button>
            <button
              onClick={() => setFilter('month')}
              className={`px-4 py-2.5 lg:py-1.5 text-sm lg:text-xs rounded-lg transition whitespace-nowrap min-h-[44px] lg:min-h-0 ${filter === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              Month
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2.5 lg:py-1.5 text-sm lg:text-xs rounded-lg transition whitespace-nowrap min-h-[44px] lg:min-h-0 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
            >
              All
            </button>
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Client</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Service</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date & Time</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                {userRole === 'ADMIN' && (
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredAppointments().map((apt) => {
                const isPassed = isAppointmentPassed(apt.endTime);
                return (
                <tr key={apt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs">{apt.user.name}</p>
                        <p className="text-xs text-gray-500">{apt.user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <p className="font-medium text-xs">{apt.service.name}</p>
                    <p className="text-xs text-gray-500">{apt.service.duration} min</p>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-400" />
                      <span className="text-xs">{format(new Date(apt.startTime), 'MMM dd, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-600">
                        {format(new Date(apt.startTime), 'hh:mm a')}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  {userRole === 'ADMIN' && (
                    <td className="px-4 py-2">
                      <select
                        value={apt.status}
                        onChange={(e) => updateStatus(apt.id, e.target.value)}
                        disabled={isPassed}
                        className={`px-2 py-1 border border-gray-300 rounded-lg text-xs ${isPassed ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="NO_SHOW">No Show</option>
                      </select>
                    </td>
                  )}
                </tr>
              );})}
            </tbody>
          </table>
          </div>

          {getFilteredAppointments().length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">
              No appointments found
            </div>
          )}
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {getFilteredAppointments().map((apt) => {
            const isPassed = isAppointmentPassed(apt.endTime);
            return (
              <div key={apt.id} className="bg-white rounded-xl shadow-md p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-base text-gray-900 truncate">{apt.user.name}</p>
                    <p className="text-sm text-gray-500 truncate">{apt.user.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    apt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    apt.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Service</span>
                    <span className="text-sm font-medium text-gray-900">{apt.service.name} ({apt.service.duration} min)</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Date</span>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="text-sm font-medium">{format(new Date(apt.startTime), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Time</span>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm font-medium">{format(new Date(apt.startTime), 'hh:mm a')}</span>
                    </div>
                  </div>
                </div>

                {userRole === 'ADMIN' && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <select
                      value={apt.status}
                      onChange={(e) => updateStatus(apt.id, e.target.value)}
                      disabled={isPassed}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg text-sm min-h-[44px] ${isPassed ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="NO_SHOW">No Show</option>
                    </select>
                  </div>
                )}
              </div>
            );
          })}
          
          {getFilteredAppointments().length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl">
              No appointments found
            </div>
          )}
        </div>
    </main>
  );
}
