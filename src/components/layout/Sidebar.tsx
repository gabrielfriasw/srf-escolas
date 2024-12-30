import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, PlusCircle, Settings, X, Image } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { authService } from '../../services/authService';

interface SidebarProps {
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const { user, clearUser } = useAuthStore();
  const [logoUrl] = useState(localStorage.getItem('customLogo') || '');

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = async () => {
    const { success } = await authService.signOut();
    if (success) {
      clearUser();
      navigate('/login');
      onClose?.();
    }
  };

  const canManageClasses = user?.role === 'DIRECTOR' || user?.role === 'COORDINATOR' || user?.role === 'TEACHER';

  return (
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8" />
        ) : (
          <Image className="h-8 w-8 text-gray-500" />
        )}
        <button
          onClick={onClose}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => handleNavigation('/dashboard')}
          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <Users className="h-5 w-5" />
          <span>Turmas</span>
        </button>

        {canManageClasses && (
          <button
            onClick={() => handleNavigation('/dashboard/nova-turma')}
            className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
          >
            <PlusCircle className="h-5 w-5" />
            <span>Nova Turma</span>
          </button>
        )}

        <button
          onClick={() => handleNavigation('/dashboard/configuracoes')}
          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <Settings className="h-5 w-5" />
          <span>Configurações</span>
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-md"
      >
        <LogOut className="h-5 w-5" />
        <span>Sair</span>
      </button>
    </div>
  );
};