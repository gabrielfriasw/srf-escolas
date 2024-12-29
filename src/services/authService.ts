import { supabase } from '../lib/supabase/client';
import { UserRole } from '../types';

export const authService = {
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao fazer logout:', error);
      return { success: false, error: error.message };
    }
  },

  async getCurrentSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { success: true, session };
    } catch (error: any) {
      console.error('Erro ao obter sessão:', error);
      return { success: false, error: error.message };
    }
  }
};