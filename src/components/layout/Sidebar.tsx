import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, PlusCircle, Settings, X, Image } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [logoUrl] = useState(localStorage.getItem('customLogo') || '');

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    onClose?.();
  };

  return (
    <div className="h-screen w-64 bg-black text-white p-6 flex flex-col">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800 lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <div className="flex items-center space-x-3 mb-8">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
        ) : (
          <Image className="h-8 w-8" />
        )}
        <span className="text-xl font-bold">SRF</span>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => handleNavigation('/dashboard')}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Users className="h-5 w-5" />
          <span>Classes</span>
        </button>

        {(user?.role === 'COORDINATOR' || user?.role === 'TEACHER') && (
          <button
            onClick={() => handleNavigation('/dashboard/nova-turma')}
            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <PlusCircle className="h-5 w-5" />
            <span>New Class</span>
          </button>
        )}
      </nav>

      <div className="border-t border-gray-800 pt-4 space-y-4">
        <div className="px-3 py-2">
          <p className="font-medium">{user?.name}</p>
          <p className="text-sm text-gray-400 break-words">{user?.email}</p>
        </div>

        <button
          onClick={() => handleNavigation('/dashboard/configuracoes')}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors text-red-400"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};