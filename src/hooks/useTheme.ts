import { useEffect, useState } from 'react';

export type ThemeType = 'light' | 'dark-blue' | 'dark-black';

export const useTheme = () => {
  const [theme, setTheme] = useState<ThemeType>(
    localStorage.getItem('theme') as ThemeType || 'light'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark-blue', 'dark-black');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return { theme, setTheme };
};