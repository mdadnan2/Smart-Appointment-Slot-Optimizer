'use client';

import { Check, X, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function AppointmentRequest() {
  const [requests, setRequests] = useState<any[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<{ show: boolean; id: string; status: string; message: string }>({ show: false, id: '', status: '', message: '' });

  useEffect(() => {
    fetchPendingAppointments();
  }, []);

  const fetchPendingAppointments = async () => {
    try {
      const providerId = localStorage.getItem('providerId');
      const { data } = await api.get(`/appointments?providerId=${providerId}`);
      const pending = data.filter((apt: any) => apt.status === 'PENDING').slice(0, 5);
      setRequests(pending);
    } catch (error) {
      console.error('Failed to fetch pending appointments', error);
    }
  };

  const handleAction = async (id: string, status: string) => {
    const message = status === 'CONFIRMED' 
      ? 'Are you sure you want to confirm this appointment?' 
      : 'Are you sure you want to reject this appointment?';
    setConfirmDialog({ show: true, id, status, message });
  };

  const confirmAction = async () => {
    try {
      await api.patch(`/appointments/${confirmDialog.id}/status`, { status: confirmDialog.status });
      setConfirmDialog({ show: false, id: '', status: '', message: '' });
      fetchPendingAppointments();
    } catch (error) {
      console.error('Failed to update appointment', error);
    }
  };

  return (
    <>
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 shadow-sm">
      <h2 className="text-sm font-bold text-blue-900 mb-4">Appointment Requests</h2>
      
      {requests.length === 0 ? (
        <p className="text-gray-600 text-xs">No pending requests</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                {request.user?.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-blue-900">{request.user?.name}</p>
                <p className="text-xs text-gray-600">{request.service?.name}</p>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={() => handleAction(request.id, 'CONFIRMED')}
                  className="w-7 h-7 bg-blue-200 hover:bg-blue-300 rounded-lg flex items-center justify-center"
                  title="Confirm"
                >
                  <Check size={14} className="text-blue-900" />
                </button>
                <button 
                  onClick={() => handleAction(request.id, 'CANCELLED')}
                  className="w-7 h-7 bg-red-200 hover:bg-red-300 rounded-lg flex items-center justify-center"
                  title="Reject"
                >
                  <X size={14} className="text-red-900" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    {confirmDialog.show && (
      <ConfirmDialog
        message={confirmDialog.message}
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog({ show: false, id: '', status: '', message: '' })}
      />
    )}
    </>
  );
}
