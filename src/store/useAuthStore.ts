import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '../types';
import { authService } from '../lib/supabase/services/auth.service';

interface AuthState {
  user: Omit<User, 'password'> | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: Omit<User, 'password'>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const { session } = await authService.signIn(email, password);
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.name,
              role: session.user.user_metadata.role,
            },
            isAuthenticated: true,
          });
        }
      },
      register: async (name: string, email: string, password: string, role: UserRole) => {
        const { session } = await authService.signUp(email, password, name, role);
        if (session?.user) {
          set({
            user: {
              id: session.user.id,
              email: session.user.email!,
              name: session.user.user_metadata.name,
              role: session.user.user_metadata.role,
            },
            isAuthenticated: true,
          });
        }
      },
      logout: async () => {
        await authService.signOut();
        set({ user: null, isAuthenticated: false });
      },
      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);