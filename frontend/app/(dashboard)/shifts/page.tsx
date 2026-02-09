'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Clock, Plus, Trash2, CalendarOff } from 'lucide-react';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';
import { format, startOfWeek, addDays } from 'date-fns';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const SHIFT_TYPES = ['MORNING', 'EVENING', 'FULL_DAY'];

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    dayOfWeek: 'MONDAY',
    shiftType: 'MORNING',
    startHour: '09',
    startMinute: '00',
    startPeriod: 'AM',
    endHour: '06',
    endMinute: '00',
    endPeriod: 'PM',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    fetchShifts();
    fetchHolidays();
  }, []);

  const fetchShifts = async () => {
    try {
      const providerId = localStorage.getItem('providerId');
      const { data } = await api.get(`/working-hours?providerId=${providerId}`);
      setShifts(data);
    } catch (error) {
      console.error('Failed to fetch shifts', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHolidays = async () => {
    try {
      const providerId = localStorage.getItem('providerId');
      const { data } = await api.get(`/holidays?providerId=${providerId}`);
      setHolidays(data);
    } catch (error) {
      console.error('Failed to fetch holidays', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const providerId = localStorage.getItem('providerId');
      
      // Convert 12-hour to 24-hour format
      const convertTo24Hour = (hour: string, minute: string, period: string) => {
        let h = parseInt(hour);
        if (period === 'PM' && h !== 12) h += 12;
        if (period === 'AM' && h === 12) h = 0;
        return `${h.toString().padStart(2, '0')}:${minute}`;
      };

      await api.post('/working-hours', {
        providerId,
        dayOfWeek: formData.dayOfWeek,
        shiftType: formData.shiftType,
        startTime: convertTo24Hour(formData.startHour, formData.startMinute, formData.startPeriod),
        endTime: convertTo24Hour(formData.endHour, formData.endMinute, formData.endPeriod),
      });
      setShowModal(false);
      fetchShifts();
      setFormData({
        dayOfWeek: 'MONDAY',
        shiftType: 'MORNING',
        startHour: '09',
        startMinute: '00',
        startPeriod: 'AM',
        endHour: '06',
        endMinute: '00',
        endPeriod: 'PM',
      });
    } catch (error) {
      console.error('Failed to create shift', error);
      setToast({ message: 'Failed to create shift', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this shift?',
      onConfirm: async () => {
        try {
          await api.delete(`/working-hours/${id}`);
          fetchShifts();
          setToast({ message: 'Shift deleted successfully', type: 'success' });
        } catch (error) {
          console.error('Failed to delete shift', error);
          setToast({ message: 'Failed to delete shift', type: 'error' });
        }
        setConfirmDialog(null);
      },
    });
  };

  const getCurrentWeekDates = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
    return DAYS.map((day, index) => ({
      day,
      date: addDays(weekStart, index),
    }));
  };

  const getHolidaysForDate = (date: Date) => {
    const localDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return holidays.filter(h => {
      const holidayDateStr = h.date.split('T')[0];
      return holidayDateStr === localDateStr;
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
    <main className="h-screen overflow-y-auto p-4 sm:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Working Hours & Shifts</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Manage your clinic timings</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              <Plus size={16} />
              Add Shift
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {getCurrentWeekDates().map(({ day, date }, index) => {
              const dayShifts = shifts.filter((s) => s.dayOfWeek === day && s.isActive);
              const dayHolidays = getHolidaysForDate(date);
              const hasHoliday = dayHolidays.length > 0;
              return (
                <div key={day} className={`bg-white rounded-xl shadow-md p-3 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 stagger-item ${hasHoliday ? 'opacity-75' : ''}`} style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="mb-2">
                    <h3 className="font-bold text-sm text-gray-800">{day}</h3>
                    <p className="text-xs text-gray-500">{format(date, 'MMM dd, yyyy')}</p>
                  </div>
                  
                  {dayHolidays.length > 0 && (
                    <div className="mb-2">
                      {dayHolidays.map((holiday) => (
                        <div key={holiday.id} className="flex items-center gap-1.5 p-1.5 bg-red-50 rounded-lg mb-1">
                          <CalendarOff size={12} className="text-red-600" />
                          <span className="text-xs text-red-700 font-medium">{holiday.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {hasHoliday ? (
                    <p className="text-gray-400 text-xs italic">Shifts disabled due to holiday</p>
                  ) : dayShifts.length === 0 ? (
                    <p className="text-gray-500 text-xs">No shifts configured</p>
                  ) : (
                    <div className="space-y-1.5">
                      {dayShifts.map((shift) => {
                        const formatTime = (time: string) => {
                          const [hours, minutes] = time.split(':').map(Number);
                          const period = hours >= 12 ? 'PM' : 'AM';
                          const displayHours = hours % 12 || 12;
                          return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
                        };
                        
                        return (
                        <div
                          key={shift.id}
                          className="flex items-center justify-between p-1.5 bg-gray-50 rounded-lg"
                        >
                          <div>
                            <div className="flex items-center gap-1.5 text-xs">
                              <Clock size={12} />
                              <span className="font-semibold">
                                {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">{shift.shiftType}</span>
                          </div>
                          <button
                            onClick={() => handleDelete(shift.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )})}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
    </main>

    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Working Shift</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Day</label>
                <select
                  value={formData.dayOfWeek}
                  onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Shift Type</label>
                <select
                  value={formData.shiftType}
                  onChange={(e) => setFormData({ ...formData, shiftType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {SHIFT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Start Time</label>
                  <div className="flex gap-1">
                    <select
                      value={formData.startHour}
                      onChange={(e) => setFormData({ ...formData, startHour: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = (i + 1).toString().padStart(2, '0');
                        return <option key={hour} value={hour}>{hour}</option>;
                      })}
                    </select>
                    <select
                      value={formData.startMinute}
                      onChange={(e) => setFormData({ ...formData, startMinute: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={formData.startPeriod}
                      onChange={(e) => setFormData({ ...formData, startPeriod: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">End Time</label>
                  <div className="flex gap-1">
                    <select
                      value={formData.endHour}
                      onChange={(e) => setFormData({ ...formData, endHour: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const hour = (i + 1).toString().padStart(2, '0');
                        return <option key={hour} value={hour}>{hour}</option>;
                      })}
                    </select>
                    <select
                      value={formData.endMinute}
                      onChange={(e) => setFormData({ ...formData, endMinute: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="00">00</option>
                      <option value="15">15</option>
                      <option value="30">30</option>
                      <option value="45">45</option>
                    </select>
                    <select
                      value={formData.endPeriod}
                      onChange={(e) => setFormData({ ...formData, endPeriod: e.target.value })}
                      className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add Shift
                </button>
              </div>
            </form>
          </div>
        </div>
    )}
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    {confirmDialog && (
      <ConfirmDialog
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(null)}
      />
    )}
    </>
  );
}
