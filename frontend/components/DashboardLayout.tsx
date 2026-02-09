'use client';

import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarWidth, setSidebarWidth] = useState('16rem');

  useEffect(() => {
    // Set initial width
    const updateWidth = () => {
      const width = getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width');
      if (width && width.trim()) {
        setSidebarWidth(width.trim());
      }
    };

    updateWidth();

    const observer = new MutationObserver(updateWidth);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['style']
    });

    // Also listen for custom event
    const handleSidebarChange = () => updateWidth();
    window.addEventListener('sidebar-change', handleSidebarChange);

    return () => {
      observer.disconnect();
      window.removeEventListener('sidebar-change', handleSidebarChange);
    };
  }, []);

  return (
    <div className="transition-all duration-300 ml-0 lg:ml-[var(--sidebar-width)] pt-14 lg:pt-0">
      {children}
    </div>
  );
}
