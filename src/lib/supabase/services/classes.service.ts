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
    const { data, error } = await supabase
      .from('classes')
      .insert(classData)
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

  updateClass: async (id: string, updates: Partial<ClassWithStudents>) => {
    const { data, error } = await supabase
      .from('classes')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        students (
          *,
          incidents (*)
        )
      `)
      .single();
    
    if (error) {
      console.error('Error updating class:', error);
      throw error;
    }

    return data;
  },

  deleteClass: async (id: string) => {
    const { error } = await supabase
      .from('classes')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  },
};