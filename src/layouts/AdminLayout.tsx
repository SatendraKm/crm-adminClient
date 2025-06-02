import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminTopbar from '../components/AdminTopbar';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMobileSidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  const closeMobileSidebar = () => setIsMobileSidebarOpen(false);
  const openMobileSidebar = () => setIsMobileSidebarOpen(true);

  return (
    <div className="min-h-screen bg-base-100 overflow-x-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-screen">
        {/* Desktop Sidebar */}
        <div className="flex-shrink-0">
          <AdminSidebar collapsed={false} />
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminTopbar onMenuClick={openMobileSidebar} />
          <main className="flex-1 overflow-auto bg-base-50 p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Mobile Topbar */}
        <AdminTopbar onMenuClick={openMobileSidebar} />

        {/* Mobile Main Content */}
        <main className="flex-1 bg-base-50 p-4 sm:p-6 overflow-auto">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden">
          {/* Backdrop with blur effect */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
          />

          {/* Sidebar Drawer with slide animation */}
          <div
            className="fixed top-0 left-0 h-full w-80 sm:w-72 bg-base-200 shadow-2xl z-50 transform transition-transform duration-300 ease-out border-r border-base-300"
            style={{
              transform: isMobileSidebarOpen
                ? 'translateX(0)'
                : 'translateX(-100%)',
            }}
          >
            <AdminSidebar collapsed={false} close={closeMobileSidebar} />
          </div>
        </div>
      )}
    </div>
  );
}
