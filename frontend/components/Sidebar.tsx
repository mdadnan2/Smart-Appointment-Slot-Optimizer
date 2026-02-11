'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Calendar, User, LogOut, ChevronLeft, ChevronRight, Clock, CalendarOff, Briefcase, Menu, X } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutTimer, setLogoutTimer] = useState(5);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const collapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    setUserRole(role || '');
    setUser({ name: userName || 'Dr. Marttin Deo' });
    setIsCollapsed(collapsed);
    
    // Set initial sidebar width
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '5rem' : '14rem');
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '5rem' : '14rem');
      window.dispatchEvent(new Event('sidebar-change'));
    }
  }, [isCollapsed]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showLogoutModal && logoutTimer > 0) {
      interval = setInterval(() => {
        setLogoutTimer((prev) => prev - 1);
      }, 1000);
    } else if (logoutTimer === 0) {
      handleLogout();
    }
    return () => clearInterval(interval);
  }, [showLogoutModal, logoutTimer]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
    {/* Mobile Header */}
    <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center px-4 z-50">
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="p-2 text-gray-700 hover:bg-gray-100 rounded transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <Menu size={22} />
      </button>
      <span className="ml-3 font-semibold text-gray-900 text-base">Dashboard</span>
    </div>

    {/* Mobile Overlay */}
    {isMobileOpen && (
      <div
        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsMobileOpen(false)}
      />
    )}

    <aside className={`fixed top-0 h-full bg-white border-gray-200 flex flex-col transition-all duration-300 overflow-hidden z-40 w-64 lg:w-56 ${
      isCollapsed ? 'lg:w-20' : 'lg:w-56'
    } lg:left-0 lg:border-r lg:translate-x-0 left-0 border-r ${
      isMobileOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header */}
      <div className={`p-4 lg:p-3 border-b border-gray-200 flex items-center mt-14 lg:mt-0 ${isCollapsed ? 'lg:justify-center' : ''}`}>
        <div className={`w-10 h-10 lg:w-10 lg:h-10 ${isCollapsed ? 'lg:w-8 lg:h-8' : ''} rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
          {user?.name?.charAt(0) || 'D'}
        </div>
        <div className={`ml-3 overflow-hidden ${isCollapsed ? 'lg:hidden' : ''}`}>
          <h2 className="font-bold text-sm text-gray-900 truncate">{user?.name || 'User'}</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-2 space-y-1.5 lg:space-y-1 overflow-y-auto">
        <Link
          href={userRole === 'ADMIN' ? '/dashboard' : '/patient-dashboard'}
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 lg:py-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : 'lg:gap-2 lg:px-3'} rounded-lg transition-all min-h-[44px] ${
            isActive(userRole === 'ADMIN' ? '/dashboard' : '/patient-dashboard')
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Dashboard"
        >
          <LayoutDashboard size={20} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
          <span className={`font-medium text-sm lg:text-xs ${isCollapsed ? 'lg:hidden' : ''}`}>Dashboard</span>
        </Link>
        <Link
          href="/appointments"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 lg:py-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : 'lg:gap-2 lg:px-3'} rounded-lg transition-all min-h-[44px] ${
            isActive('/appointments')
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Appointments"
        >
          <Calendar size={20} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
          <span className={`font-medium text-sm lg:text-xs ${isCollapsed ? 'lg:hidden' : ''}`}>Appointments</span>
        </Link>
        {userRole === 'ADMIN' && (
          <>
            <Link
              href="/services"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 lg:py-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : 'lg:gap-2 lg:px-3'} rounded-lg transition-all min-h-[44px] ${
                isActive('/services')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Services"
            >
              <Briefcase size={20} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
              <span className={`font-medium text-sm lg:text-xs ${isCollapsed ? 'lg:hidden' : ''}`}>Services</span>
            </Link>
            <Link
              href="/shifts"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 lg:py-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : 'lg:gap-2 lg:px-3'} rounded-lg transition-all min-h-[44px] ${
                isActive('/shifts')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Shifts"
            >
              <Clock size={20} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
              <span className={`font-medium text-sm lg:text-xs ${isCollapsed ? 'lg:hidden' : ''}`}>Shifts</span>
            </Link>
            <Link
              href="/holidays"
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 lg:py-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : 'lg:gap-2 lg:px-3'} rounded-lg transition-all min-h-[44px] ${
                isActive('/holidays')
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Holidays"
            >
              <CalendarOff size={20} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
              <span className={`font-medium text-sm lg:text-xs ${isCollapsed ? 'lg:hidden' : ''}`}>Holidays</span>
            </Link>
          </>
        )}
        <Link
          href="/profile"
          onClick={() => setIsMobileOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 lg:py-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : 'lg:gap-2 lg:px-3'} rounded-lg transition-all min-h-[44px] ${
            isActive('/profile')
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Profile"
        >
          <User size={20} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
          <span className={`font-medium text-sm lg:text-xs ${isCollapsed ? 'lg:hidden' : ''}`}>Profile</span>
        </Link>
        <button
          onClick={() => {
            setShowLogoutModal(true);
            setLogoutTimer(5);
          }}
          className={`flex items-center gap-3 px-4 py-3 lg:py-2 ${isCollapsed ? 'lg:justify-center lg:px-2 lg:gap-0' : 'lg:gap-2 lg:px-3'} rounded-lg transition-all min-h-[44px] text-gray-600 hover:bg-red-50 hover:text-red-600 w-full`}
          title="Logout"
        >
          <LogOut size={20} className="lg:w-[18px] lg:h-[18px] flex-shrink-0" />
          <span className={`font-medium text-sm lg:text-xs ${isCollapsed ? 'lg:hidden' : ''}`}>Logout</span>
        </button>
      </nav>

      {/* Collapse Button - Desktop Only */}
      <div className="p-3 lg:p-2 border-t border-gray-200 hidden lg:block">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const newState = !isCollapsed;
            setIsCollapsed(newState);
            localStorage.setItem('sidebarCollapsed', String(newState));
          }}
          className={`w-full flex items-center justify-center ${isCollapsed ? 'px-2' : 'gap-1 px-3'} py-2 border-2 border-blue-600 rounded-lg text-blue-600 hover:bg-blue-50 transition-all font-medium text-xs`}
        >
          {isCollapsed ? (
            <ChevronRight size={16} className="flex-shrink-0" />
          ) : (
            <>
              <ChevronLeft size={16} />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>

    {/* Logout Modal */}
    {showLogoutModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
          <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">Confirm Logout</h3>
          <p className="text-sm lg:text-base text-gray-600 mb-6">Logging out in {logoutTimer} seconds...</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setShowLogoutModal(false);
                setLogoutTimer(5);
              }}
              className="flex-1 px-4 py-3 lg:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium text-sm lg:text-base min-h-[44px]"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 px-4 py-3 lg:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm lg:text-base min-h-[44px]"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  );
}
