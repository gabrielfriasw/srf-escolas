import { supabase } from '../lib/supabase/client';
import { Class } from '../types';

export const classService = {
  async createClass(classData: Omit<Class, 'id'>) {
    try {
      // First create the class
      const { data: newClass, error: classError } = await supabase
        .from('classes')
        .insert({
          name: classData.name,
          grade: classData.grade,
          shift: classData.shift,
          pedagogist_phone: classData.pedagogistPhone,
          owner_id: classData.ownerId
        })
        .select()
        .single();

      if (classError) throw classError;

      // Then create teacher assignments
      if (classData.teacherIds.length > 0) {
        const teacherAssignments = classData.teacherIds.map(email => ({
          class_id: newClass.id,
          teacher_email: email,
          status: 'PENDING'
        }));

        const { error: assignmentError } = await supabase
          .from('class_teachers')
          .insert(teacherAssignments);

        if (assignmentError) throw assignmentError;
      }

      return { success: true, data: newClass };
    } catch (error: any) {
      console.error('Error creating class:', error);
      return { success: false, error: error.message };
    }
  },

  async getClassesForUser(userId: string) {
    try {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (userProfile?.role === 'DIRECTOR') {
        // Directors can see all classes
        const { data, error } = await supabase
          .from('classes')
          .select(`
            *,
            class_teachers (
              teacher_id,
              status
            )
          `);
        if (error) throw error;
        return { success: true, data };
      } else {
        // Teachers see only their assigned classes
        const { data, error } = await supabase
          .from('class_teachers')
          .select(`
            status,
            class:classes (
              *,
              class_teachers (
                teacher_id,
                status
              )
            )
          `)
          .eq('teacher_id', userId)
          .eq('status', 'ACCEPTED');

        if (error) throw error;
        return { success: true, data: data?.map(d => d.class) || [] };
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      return { success: false, error: error.message };
    }
  }
};