import { supabase } from '../supabase';
import type { ClassWithStudents } from '../../../types/database';

export const classesService = {
  getClasses: async () => {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        students (
          *,
          incidents (*)
        )
      `);
    
    if (error) throw error;
    return data as ClassWithStudents[];
  },

  createClass: async (classData: {
    name: string;
    grade: string;
    pedagogist_phone: string;
    shift: 'morning' | 'afternoon' | 'night';
    owner_id: string;
  }) => {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateClass: async (id: string, updates: Partial<ClassWithStudents>) => {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  deleteClass: async (id: string) => {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },
};