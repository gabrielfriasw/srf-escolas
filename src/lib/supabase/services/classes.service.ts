import { supabase } from '../supabase';
import type { ClassWithStudents } from '../../../types/database';

export const classesService = {
  getClasses: async () => {
    const { data: classes, error } = await supabase
      .from('classes')
      .select(`
        *,
        students (
          *,
          incidents (*)
        )
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }

    return classes as ClassWithStudents[];
  },

  createClass: async (classData: {
    name: string;
    grade: string;
    pedagogist_phone: string;
    shift: 'morning' | 'afternoon' | 'night';
    owner_id: string;
  }) => {
    // Ensure owner_id is set to the authenticated user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from('classes')
      .insert({
        ...classData,
        owner_id: userData.user.id // Garantir que owner_id seja o ID do usuário autenticado
      })
      .select(`
        *,
        students (
          *,
          incidents (*)
        )
      `)
      .single();
    
    if (error) {
      console.error('Error creating class:', error);
      throw error;
    }

    return data;
  },

  // ... rest of the service methods remain the same
};