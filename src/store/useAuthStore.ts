import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) throw new Error(authError.message);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (!profile) throw new Error('Perfil não encontrado');

        const user: User = {
          id: authData.user.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
        };

        set({ user, isAuthenticated: true });
      },
      register: async (name: string, email: string, password: string, role: UserRole) => {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw new Error(authError.message);
        if (!authData.user) throw new Error('Erro ao criar usuário');

        const { error: profileError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          name,
          email,
          role,
        });

        if (profileError) throw new Error(profileError.message);

        const user: User = {
          id: authData.user.id,
          name,
          email,
          role,
        };

        set({ user, isAuthenticated: true });
      },
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);