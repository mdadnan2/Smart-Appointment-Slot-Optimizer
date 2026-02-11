'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { format, addDays } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import Toast from '@/components/Toast';

export default function BookAppointment() {
  const [user, setUser] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchUserData();
    fetchProviders();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const { data } = await api.get(`/users/${userId}`);
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user', error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProvider) {
      fetchServices();
    }
  }, [selectedProvider]);

  useEffect(() => {
    if (selectedProvider && selectedService && selectedDate) {
      fetchSlots();
    }
  }, [selectedProvider, selectedService, selectedDate]);

  const fetchProviders = async () => {
    try {
      const { data } = await api.get('/providers');
      setProviders(data);
      if (data.length > 0) setSelectedProvider(data[0].id);
    } catch (error) {
      console.error('Failed to fetch providers', error);
    }
  };

  const fetchServices = async () => {
    try {
      const { data } = await api.get(`/services?providerId=${selectedProvider}`);
      setServices(data);
      if (data.length > 0) setSelectedService(data[0].id);
    } catch (error) {
      console.error('Failed to fetch services', error);
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    setSlots([]);
    try {
      const service = services.find(s => s.id === selectedService);
      if (!service) {
        console.log('No service selected');
        return;
      }
      
      console.log('Fetching slots:', {
        providerId: selectedProvider,
        date: selectedDate,
        duration: service.duration
      });
      
      const { data } = await api.get(
        `/slots?providerId=${selectedProvider}&date=${selectedDate}&duration=${service?.duration || 30}`
      );
      
      console.log('Slots response:', data);
      setSlots(data.slots || []);
    } catch (error: any) {
      console.error('Failed to fetch slots', error.response?.data || error);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    setLoading(true);
    try {
      const userId = localStorage.getItem('userId');
      await api.post('/appointments', {
        providerId: selectedProvider,
        userId,
        serviceId: selectedService,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/appointments';
      }, 2000);
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || 'Booking failed', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Redirecting to appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen p-4 sm:p-6 lg:p-8 animate-fade-in">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Book Appointment</h1>
          <p className="text-sm sm:text-base text-gray-600">Select date and time for your appointment</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Selection Panel */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-md">
            <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">Appointment Details</h2>

            {/* Provider Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Provider
              </label>
              <select
                value={selectedProvider}
                onChange={(e) => setSelectedProvider(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base min-h-[44px]"
              >
                {providers.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.user.name} - {provider.specialty}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base min-h-[44px]"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.duration} min {service.price && `($${service.price})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                max={format(addDays(new Date(), 30), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-base min-h-[44px]"
              />
            </div>

            {/* Available Slots */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              {loading ? (
                <div className="text-center py-8 text-gray-500">Loading slots...</div>
              ) : slots.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">No available slots for this date</p>
                  <p className="text-sm text-gray-500">
                    Try selecting a weekday (Mon-Fri) or check browser console for details
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
                  {slots.map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-3 lg:py-3 rounded-lg border-2 transition text-sm min-h-[44px] ${
                        selectedSlot?.startTime === slot.startTime
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      {format(new Date(slot.startTime), 'hh:mm a')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Summary Panel */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-md h-fit">
            <h2 className="text-lg sm:text-xl font-bold mb-5 sm:mb-6">Booking Summary</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-semibold">
                  {providers.find(p => p.id === selectedProvider)?.user.name || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Service</p>
                <p className="font-semibold">
                  {services.find(s => s.id === selectedService)?.name || '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold">
                  {selectedDate ? format(new Date(selectedDate), 'MMM dd, yyyy') : '-'}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Time</p>
                <p className="font-semibold">
                  {selectedSlot
                    ? `${format(new Date(selectedSlot.startTime), 'hh:mm a')} - ${format(
                        new Date(selectedSlot.endTime),
                        'hh:mm a'
                      )}`
                    : '-'}
                </p>
              </div>

              {services.find(s => s.id === selectedService)?.price && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    ${services.find(s => s.id === selectedService)?.price}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleBooking}
              disabled={!selectedSlot || loading}
              className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              {loading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </main>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
