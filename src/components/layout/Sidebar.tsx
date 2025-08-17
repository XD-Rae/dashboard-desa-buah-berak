import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Award,
  Calendar,
  Building,
  MessageSquare,
  FileText,
  Lightbulb,
  Shapes,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth();
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-500 text-white'
        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-30 h-full w-64 transform bg-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col border-r border-gray-200">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-800">ADMINISTRASI</h1>
            <button
              onClick={toggleSidebar}
              className="rounded p-1 text-gray-700 hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 space-y-1 p-4">
            <NavLink to="/" className={navLinkClass} end>
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink to="/faculty" className={navLinkClass}>
              <Users size={20} />
              <span>Data Aparatur</span>
            </NavLink>
            
            {user?.role === 'admin' && (
              <>
                <NavLink to="/achievements" className={navLinkClass}>
                  <Award size={20} />
                  <span>Prestasi Desa</span>
                </NavLink>
                
                <NavLink to="/events" className={navLinkClass}>
                  <Calendar size={20} />
                  <span>Data Kegiatan</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <div className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Desa Admin
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;