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

      // Then create teacher assignments if any
      if (classData.teacherIds?.length > 0) {
        const { data: teachers, error: teachersError } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', 'TEACHER')
          .in('email', classData.teacherIds);

        if (teachersError) throw teachersError;

        if (teachers && teachers.length > 0) {
          const teacherAssignments = teachers.map(teacher => ({
            class_id: newClass.id,
            teacher_id: teacher.id,
            status: 'PENDING'
          }));

          const { error: assignmentError } = await supabase
            .from('class_teachers')
            .insert(teacherAssignments);

          if (assignmentError) throw assignmentError;
        }
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
          .select('*');
        
        if (error) throw error;
        return { success: true, data };
      } else {
        // Teachers see only their assigned classes
        const { data, error } = await supabase
          .from('classes')
          .select('*')
          .in('id', (
            await supabase
              .from('class_teachers')
              .select('class_id')
              .eq('teacher_id', userId)
              .eq('status', 'ACCEPTED')
          ).data?.map(ct => ct.class_id) || []);

        if (error) throw error;
        return { success: true, data: data || [] };
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      return { success: false, error: error.message };
    }
  }
};