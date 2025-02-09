import { supabase } from '../supabase';
import type { UserRole } from '../../../types';

// Helper function to ensure user profile exists
const ensureUserProfile = async (userId: string, email: string, name: string, role: UserRole) => {
  // First check if profile exists
  const { data: profile, error: checkError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
    console.error('Erro ao verificar perfil:', checkError);
    throw checkError;
  }

  // If profile doesn't exist, create it
  if (!profile) {
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email,
        name,
        role
      });

    if (createError) {
      console.error('Erro ao criar perfil:', createError);
      throw createError;
    }
  }

  return true;
};

export const authService = {
  // Cadastro de usuário
  signUp: async (email: string, password: string, name: string, role: UserRole) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Usuário não criado');

      await ensureUserProfile(authData.user.id, email, name, role);

      return authData;
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  },

  // Login de usuário
  signIn: async (email: string, password: string) => {
    try {
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!authData.user) throw new Error('Login falhou');

      // Get user profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        // If profile doesn't exist, create it with default role
        await ensureUserProfile(authData.user.id, email, email.split('@')[0], 'teacher');
      }

      return authData;
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  },

  // Logout de usuário
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error in signOut:', error);
      throw error;
    }
  },

  // Obter sessão atual
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      if (!session) return null;

      // Ensure profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (!profile) {
        await ensureUserProfile(
          session.user.id,
          session.user.email || '',
          session.user.email?.split('@')[0] || 'Usuário',
          'teacher'
        );
      }

      return session;
    } catch (error) {
      console.error('Error in getSession:', error);
      throw error;
    }
  }
};