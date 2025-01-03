import React from 'react';
import { Moon, Sun, Loader } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuthStore } from '../store/useAuthStore';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all transform hover:scale-105 active:scale-95 duration-200"
      aria-label="Alternar tema"
    >
      {isAuthenticated ? (
        theme === 'dark' ? (
          <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        ) : (
          <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        )
      ) : (
        <Loader className="w-5 h-5 text-gray-700 dark:text-gray-300 animate-spin" />
      )}
    </button>
  );
};