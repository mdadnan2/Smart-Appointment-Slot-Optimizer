'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSundayModal, setShowSundayModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    isRecurring: false,
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const providerId = localStorage.getItem('providerId');
      const { data } = await api.get(`/holidays?providerId=${providerId}`);
      setHolidays(data);
    } catch (error) {
      console.error('Failed to fetch holidays', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const providerId = localStorage.getItem('providerId');
      await api.post('/holidays', {
        ...formData,
        providerId,
      });
      setShowModal(false);
      fetchHolidays();
      setFormData({
        title: '',
        date: '',
        isRecurring: false,
      });
    } catch (error) {
      console.error('Failed to create holiday', error);
      setToast({ message: 'Failed to create holiday', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this holiday?',
      onConfirm: async () => {
        try {
          await api.delete(`/holidays/${id}`);
          fetchHolidays();
          setToast({ message: 'Holiday deleted successfully', type: 'success' });
        } catch (error) {
          console.error('Failed to delete holiday', error);
          setToast({ message: 'Failed to delete holiday', type: 'error' });
        }
        setConfirmDialog(null);
      },
    });
  };

  const handleMarkSundays = async () => {
    if (!selectedMonth || !selectedYear) {
      setToast({ message: 'Please select month and year', type: 'error' });
      return;
    }

    try {
      const providerId = localStorage.getItem('providerId');
      const year = parseInt(selectedYear);
      const month = parseInt(selectedMonth);
      
      // Get all Sundays in the selected month
      const sundays = [];
      const date = new Date(year, month - 1, 1);
      while (date.getMonth() === month - 1) {
        if (date.getDay() === 0) {
          const sundayDate = new Date(date);
          sundays.push(sundayDate);
        }
        date.setDate(date.getDate() + 1);
      }

      // Create holiday for each Sunday
      for (const sunday of sundays) {
        const year = sunday.getFullYear();
        const month = String(sunday.getMonth() + 1).padStart(2, '0');
        const day = String(sunday.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        await api.post('/holidays', {
          providerId,
          title: 'Sunday Off',
          date: dateStr,
          isRecurring: false,
        });
      }

      setShowSundayModal(false);
      fetchHolidays();
      setToast({ message: `${sundays.length} Sundays marked as holidays`, type: 'success' });
    } catch (error) {
      console.error('Failed to mark Sundays', error);
      setToast({ message: 'Failed to mark Sundays', type: 'error' });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <>
    <main className="h-screen overflow-y-auto p-4 sm:p-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Holidays</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Manage clinic holidays and off days</p>
            </div>
            <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              <Plus size={16} />
              Add Holiday
            </button>
            <button
              onClick={() => setShowSundayModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition whitespace-nowrap"
            >
              <Calendar size={16} />
              Mark Sundays
            </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md">
            {holidays.length === 0 ? (
              <div className="p-6 text-center text-gray-500 text-xs">
                No holidays configured
              </div>
            ) : (
              <div className="divide-y">
                {holidays.map((holiday) => (
                  <div
                    key={holiday.id}
                    className="p-3 flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-gray-800">{holiday.title}</h3>
                        <p className="text-xs text-gray-600">
                          {new Date(holiday.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {holiday.isRecurring && (
                          <span className="text-xs text-blue-600 font-medium">Recurring</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(holiday.id)}
                      className="text-red-600 hover:text-red-700 p-1.5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
    </main>

    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Holiday</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Christmas, Eid, Weekly Off"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={formData.isRecurring}
                  onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="recurring" className="text-sm text-gray-700">
                  Recurring holiday (repeats every year)
                </label>
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
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
    )}

    {showSundayModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Mark All Sundays as Holiday</h3>
            <p className="text-sm text-gray-600 mb-4">Select month and year to mark all Sundays as holidays</p>
            <form onSubmit={(e) => { e.preventDefault(); handleMarkSundays(); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Month</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Month</option>
                    <option value="1">January</option>
                    <option value="2">February</option>
                    <option value="3">March</option>
                    <option value="4">April</option>
                    <option value="5">May</option>
                    <option value="6">June</option>
                    <option value="7">July</option>
                    <option value="8">August</option>
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowSundayModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Mark Sundays
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
