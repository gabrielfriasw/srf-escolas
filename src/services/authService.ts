import { supabase } from '../lib/supabase/client';
import { UserRole } from '../types';

export const authService = {
  async register(name: string, email: string, password: string, role: UserRole) {
    try {
      // 1. Registra o usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Cria o perfil manualmente (caso o trigger não funcione)
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name,
          email: email.toLowerCase(),
          role
        })
        .select()
        .single();

      // Se der erro de unique violation, significa que o trigger já criou o perfil
      if (profileError && !profileError.message.includes('unique violation')) {
        throw profileError;
      }

      return {
        id: authData.user.id,
        name,
        email,
        role
      };
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.message || 'Erro ao registrar usuário');
    }
  },

  async login(email: string, password: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Usuário não encontrado');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;
      if (!profile) throw new Error('Perfil não encontrado');

      return profile;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    }
  }
};