'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import Toast from '@/components/Toast';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const { data } = await api.get(`/users/${userId}`);
      setUser(data);
      setFormData({ name: data.name, phone: data.phone || '' });
    } catch (error) {
      console.error('Failed to fetch user', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const userId = localStorage.getItem('userId');
      const { data } = await api.patch(`/users/${userId}`, formData);
      setUser(data);
      setIsEditing(false);
      localStorage.setItem('userName', data.name);
      setToast({ message: 'Profile updated successfully', type: 'success' });
    } catch (error) {
      console.error('Failed to update user', error);
      setToast({ message: 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name, phone: user.phone || '' });
    setIsEditing(false);
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><div className="text-xl">Loading...</div></div>;
  }

  return (
    <>
    <main className="h-screen overflow-y-auto p-4 sm:p-6 animate-fade-in">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-600 text-xs sm:text-sm">View your account information</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md max-w-4xl mx-auto">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-2xl p-4 sm:p-6 text-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl sm:text-4xl font-bold mx-auto mb-3 shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h2>
          </div>

          {/* Profile Information */}
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-bold text-gray-800">Personal Information</h3>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition whitespace-nowrap"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex-1 sm:flex-none px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <User size={14} />
                  <span>Full Name</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-800 pl-5">{user?.name}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Mail size={14} />
                  <span>Email Address</span>
                </div>
                <p className="text-base font-semibold text-gray-800 pl-5">{user?.email}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Phone size={14} />
                  <span>Phone Number</span>
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                ) : (
                  <p className="text-base font-semibold text-gray-800 pl-5">{user?.phone || 'Not provided'}</p>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Calendar size={14} />
                  <span>Member Since</span>
                </div>
                <p className="text-base font-semibold text-gray-800 pl-5">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
    </main>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
