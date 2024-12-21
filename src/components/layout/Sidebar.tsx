import React from 'react';
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
  const logoUrl = localStorage.getItem('customLogo') || '';

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
    <div className="h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md lg:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      <div className="flex items-center space-x-3 mb-8 mt-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 w-8 object-contain" />
        ) : (
          <Image className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        )}
        <span className="text-xl font-bold text-gray-800 dark:text-white">SRF</span>
      </div>

      <div className="flex-1">
        <nav className="space-y-2">
          <button
            onClick={() => handleNavigation('/dashboard')}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-gray-700 dark:text-gray-300">Turmas</span>
          </button>

          {(user?.role === 'COORDINATOR' || user?.role === 'TEACHER') && (
            <button
              onClick={() => handleNavigation('/dashboard/nova-turma')}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <PlusCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Nova Turma</span>
            </button>
          )}
        </nav>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            Bem vindo(a), {user?.name}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 break-words">
            {user?.email}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.role === 'COORDINATOR' ? 'Coordenador' :
             user?.role === 'TEACHER' ? 'Professor' :
             'Monitor'}
          </p>
        </div>

        <button
          onClick={() => handleNavigation('/dashboard/configuracoes')}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">Configurações</span>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};