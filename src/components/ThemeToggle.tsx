import { Moon, Sun } from 'lucide-react';
import { useStore } from '../store/useStore';

export function ThemeToggle() {
  const { darkMode, setDarkMode } = useStore();

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {darkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}