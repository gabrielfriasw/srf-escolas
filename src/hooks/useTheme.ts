import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { profileService } from '../lib/supabase/services/profile.service';

export const useTheme = () => {
  const user = useAuthStore((state) => state.user);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );

  // Load user's theme preference on login
  useEffect(() => {
    const loadUserTheme = async () => {
      if (user?.id) {
        try {
          const userTheme = await profileService.getThemePreference(user.id);
          if (userTheme) {
            setTheme(userTheme);
          }
        } catch (error) {
          console.error('Error loading theme preference:', error);
        }
      }
    };

    loadUserTheme();
  }, [user?.id]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);

    // Save theme preference if user is logged in
    if (user?.id) {
      profileService.updateThemePreference(user.id, theme).catch((error) => {
        console.error('Error saving theme preference:', error);
      });
    }
  }, [theme, user?.id]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme };
};