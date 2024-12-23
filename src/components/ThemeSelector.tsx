import React from 'react';
import { Moon, Sun, CircleDot } from 'lucide-react';
import { ThemeType } from '../hooks/useTheme';

interface ThemeSelectorProps {
  currentTheme: ThemeType;
  onThemeChange: (theme: ThemeType) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  const themes: { value: ThemeType; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Claro',
      icon: <Sun className="h-5 w-5" />,
    },
    {
      value: 'dark-blue',
      label: 'Escuro (Azul)',
      icon: <Moon className="h-5 w-5" />,
    },
    {
      value: 'dark-black',
      label: 'Escuro (Preto)',
      icon: <CircleDot className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm font-medium text-theme-secondary">
        Tema
      </label>
      <select
        value={currentTheme}
        onChange={(e) => onThemeChange(e.target.value as ThemeType)}
        className="w-full p-2 rounded-md border border-theme bg-theme-primary text-theme-primary"
      >
        {themes.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
      <div className="flex justify-between mt-2">
        {themes.map((theme) => (
          <button
            key={theme.value}
            onClick={() => onThemeChange(theme.value)}
            className={`p-3 rounded-lg flex items-center justify-center ${
              currentTheme === theme.value
                ? 'bg-accent-primary text-theme-primary'
                : 'bg-theme-secondary text-theme-secondary'
            }`}
          >
            {theme.icon}
          </button>
        ))}
      </div>
    </div>
  );
};