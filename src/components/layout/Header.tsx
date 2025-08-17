import React, { useState } from 'react';
import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../shared/ConfirmationDialog';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout');
    navigate('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-10 flex h-16 items-center border-b border-gray-200 bg-white px-4">
        <button
          onClick={toggleSidebar}
          className="rounded p-1 text-gray-700 hover:bg-gray-100 lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="ml-auto flex items-center space-x-4">
          <button className="rounded p-1 text-gray-700 hover:bg-gray-100">
            <Bell size={20} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="ml-2 hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user?.role === 'admin' ? 'Admin' : 'Aparatur'}</p>
                <p className="text-xs text-gray-500">{user?.username}</p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="rounded p-1 text-gray-700 hover:bg-gray-100"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
};

export default Header;