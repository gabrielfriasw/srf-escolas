import { supabase } from '../supabase';
import type { UserRole } from '../../../types';

export const authService = {
  // Cadastro de usuário
  signUp: async (email: string, password: string, name: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Erro no cadastro do Supabase:', error);
      throw error;
    }

    return data;
  },

  // Login de usuário
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro no login do Supabase:', error);
      throw error;
    }

    return data;
  },

  // Logout de usuário
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Erro no logout do Supabase:', error);
      throw error;
    }
  },

  // Obter sessão atual
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Erro ao obter sessão do Supabase:', error);
      throw error;
    }
    return session;
  },
};