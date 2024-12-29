import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  setUser: (user: Omit<User, 'password'>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);