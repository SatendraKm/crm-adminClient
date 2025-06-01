import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  X,
  Home,
  MapPin,
  Megaphone,
} from 'lucide-react';
import { useAppSelector } from '../redux/hooks';

interface Props {
  collapsed?: boolean;
  close?: () => void;
}

export default function AdminSidebar({ collapsed = false, close }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const menuItems = [
    {
      path: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      color: 'text-blue-600',
    },
    {
      path: '/admin/employees',
      icon: Users,
      label: 'Employees',
      color: 'text-purple-600',
    },
    {
      path: '/admin/regions',
      icon: MapPin,
      label: 'Regions',
      color: 'text-green-600',
    },
    {
      path: '/admin/campaigns',
      icon: Megaphone,
      label: 'Campaigns',
      color: 'text-red-600',
    },
  ];

  const isActiveRoute = (path: string) => location.pathname === path;
  const widthClass = isMobile ? 'w-80 sm:w-72' : isCollapsed ? 'w-16' : 'w-64';

  return (
    <aside
      className={`relative z-10 transition-all duration-300 h-full bg-gradient-to-b from-base-200 to-base-300 flex flex-col shadow-lg border-r border-base-300 ${widthClass}`}
      style={{ overflowX: 'hidden', overflowY: 'auto' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-base-300 bg-base-200/50">
        {(!isCollapsed || isMobile) && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Home className="w-5 h-5 text-primary-content" />
            </div>
            <span className="text-xl font-bold text-base-content">
              Admin Panel
            </span>
          </div>
        )}

        {isMobile && close ? (
          <button
            className="btn btn-sm btn-ghost btn-circle hover:bg-base-300 transition-colors"
            onClick={close}
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        ) : (
          !isMobile && (
            <button
              className="btn btn-sm btn-ghost btn-circle hover:bg-base-300 transition-colors"
              onClick={toggleCollapse}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          )
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={close}
              className={`
                group relative flex items-center px-3 py-3 rounded-lg transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary text-primary-content shadow-md scale-105'
                    : 'hover:bg-base-300/70 text-base-content hover:scale-102'
                }
                ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-content rounded-r-full" />
              )}

              {/* Icon */}
              <Icon
                size={20}
                className={`
                  flex-shrink-0 transition-colors duration-200
                  ${isActive ? 'text-primary-content' : item.color}
                  ${!isCollapsed || isMobile ? 'mr-3' : ''}
                `}
              />

              {/* Label */}
              {(!isCollapsed || isMobile) && (
                <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {/* {isCollapsed && !isMobile && (
                <div className="absolute left-full top-1/2 ml-3 transform -translate-y-1/2 bg-base-content text-base-100 text-sm px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 pointer-events-none">
                  {item.label}
                </div>
              )} */}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {(!isCollapsed || isMobile) && (
        <div className="p-4 border-t border-base-300 bg-base-200/30">
          <div className="flex items-center space-x-3">
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-10">
                <span className="text-sm">AD</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-base-content truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-base-content/70 truncate">
                {user?.email || 'admin@example.com'}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
