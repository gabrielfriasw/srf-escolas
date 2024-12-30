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
        // Get teacher profiles by email
        const { data: teachers, error: teachersError } = await supabase
          .from('profiles')
          .select('id')
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

  // ... rest of the service remains the same
};