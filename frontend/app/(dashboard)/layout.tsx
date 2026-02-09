'use client';

import Sidebar from '@/components/Sidebar';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <DashboardLayout>{children}</DashboardLayout>
    </div>
  );
}
