import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { userService } from '../services/database/userService';

interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const user = await userService.login(email, password);
          set({ user, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      register: async (name: string, email: string, password: string, role: UserRole) => {
        try {
          const user = await userService.register(name, email, password, role);
          set({ user, isAuthenticated: true });
        } catch (error) {
          throw error;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);