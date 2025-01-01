import { supabase } from '../supabase';
import type { Class } from '../../../types';

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
    return data;
  },

  createClass: async (classData: Omit<Class, 'id' | 'students'>) => {
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateClass: async (id: string, updates: Partial<Class>) => {
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