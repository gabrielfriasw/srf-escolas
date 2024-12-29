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
      {/* Rest of the component remains the same */}
    </div>
  );
};