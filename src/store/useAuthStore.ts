import { create } from 'zustand';
import { User, UserRole } from '../types';
import { supabase } from '../lib/supabase/supabase';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  getUsers: () => Promise<User[]>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    try {
      // First check if user exists in our users table
      const { data: existingUser, error: userCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (userCheckError) throw new Error('Erro ao verificar usuário');

      // If no user found in our table, don't even try to authenticate
      if (!existingUser) {
        throw new Error('Usuário não encontrado');
      }

      // Try to authenticate
      const { data: { user: authUser }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Senha incorreta');
        }
        throw new Error(authError.message);
      }

      if (!authUser) throw new Error('Erro ao autenticar usuário');

      set({ user: existingUser, isAuthenticated: true });
    } catch (error: any) {
      await supabase.auth.signOut();
      throw new Error(error.message);
    }
  },

  register: async (name: string, email: string, password: string, role: UserRole) => {
    try {
      // First check if user exists in our users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (existingUser) {
        throw new Error('Este email já está cadastrado');
      }

      // Create auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (authError) throw new Error(authError.message);
      if (!authUser) throw new Error('Erro ao criar usuário');

      // Create user profile
      const { data: userData, error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authUser.id,
            email,
            name,
            role,
          },
        ])
        .select()
        .single();

      if (profileError) {
        // Cleanup: delete auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authUser.id);
        throw new Error('Erro ao criar perfil do usuário');
      }

      set({ user: userData, isAuthenticated: true });
    } catch (error: any) {
      await supabase.auth.signOut();
      throw new Error(error.message);
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isAuthenticated: false });
    } catch (error: any) {
      throw new Error(error.message);
    }
  },

  getUsers: async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'STUDENT_MONITOR');

      if (error) throw error;
      return users || [];
    } catch (error: any) {
      throw new Error(error.message);
    }
  },
}));