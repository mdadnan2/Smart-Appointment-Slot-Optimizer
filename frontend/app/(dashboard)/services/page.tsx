'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { DollarSign, Clock, Plus, Trash2, Edit } from 'lucide-react';
import Toast from '@/components/Toast';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration: 30,
    price: 0,
    description: '',
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const providerId = localStorage.getItem('providerId');
      const { data } = await api.get(`/services?providerId=${providerId}`);
      setServices(data);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const providerId = localStorage.getItem('providerId');
      await api.post('/services', {
        ...formData,
        providerId,
      });
      setShowModal(false);
      fetchServices();
      setFormData({
        name: '',
        duration: 30,
        price: 0,
        description: '',
      });
    } catch (error) {
      console.error('Failed to create service', error);
      setToast({ message: 'Failed to create service', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    setConfirmDialog({
      message: 'Are you sure you want to delete this service?',
      onConfirm: async () => {
        try {
          await api.delete(`/services/${id}`);
          fetchServices();
          setToast({ message: 'Service deleted successfully', type: 'success' });
        } catch (error) {
          console.error('Failed to delete service', error);
          setToast({ message: 'Failed to delete service', type: 'error' });
        }
        setConfirmDialog(null);
      },
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Services & Pricing</h1>
              <p className="text-gray-600 text-xs sm:text-sm">Manage your services, duration, and fees</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
            >
              <Plus size={16} />
              Add Service
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-sm text-gray-800">{service.name}</h3>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                
                {service.description && (
                  <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Clock size={14} className="text-blue-600" />
                    <span className="text-xs font-medium">{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <DollarSign size={14} className="text-green-600" />
                    <span className="text-xs font-medium">₹{service.price}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${service.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {services.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-xs">
              No services configured. Add your first service!
            </div>
          )}
    </main>

    {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add Service</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., General Consultation"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="15"
                    step="15"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Brief description of the service"
                />
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
                  Add Service
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
