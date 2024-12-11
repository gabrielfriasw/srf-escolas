import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { ThemeToggle } from '../ThemeToggle';

export function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useStore();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="fixed top-0 right-0 z-50 flex items-center gap-2 p-4">
      <ThemeToggle />
      {user && (
        <button
          onClick={handleLogout}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-xl hover:bg-red-200 dark:text-red-400 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </button>
      )}
    </div>
  );
}