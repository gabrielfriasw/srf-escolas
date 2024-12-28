import { supabase } from '../lib/supabase';

export const teacherService = {
  async assignTeacher(classId: string, teacherEmail: string) {
    try {
      // First get the teacher profile by email
      const { data: teacher, error: teacherError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', teacherEmail)
        .single();

      if (teacherError) throw teacherError;
      if (!teacher) throw new Error('Professor não encontrado');
      if (teacher.role !== 'TEACHER') throw new Error('O usuário não é um professor');

      // Create the assignment
      const { error: assignError } = await supabase
        .from('class_teachers')
        .insert({
          class_id: classId,
          teacher_id: teacher.id,
          status: 'PENDING',
          assigned_by: (await supabase.auth.getUser()).data.user?.id
        });

      if (assignError) throw assignError;

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || 'Erro ao atribuir professor' 
      };
    }
  },

  async acceptAssignment(classId: string) {
    try {
      const { error } = await supabase
        .from('class_teachers')
        .update({ status: 'ACCEPTED' })
        .match({ 
          class_id: classId, 
          teacher_id: (await supabase.auth.getUser()).data.user?.id 
        });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao aceitar atribuição'
      };
    }
  },

  async rejectAssignment(classId: string) {
    try {
      const { error } = await supabase
        .from('class_teachers')
        .update({ status: 'REJECTED' })
        .match({ 
          class_id: classId, 
          teacher_id: (await supabase.auth.getUser()).data.user?.id 
        });

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao rejeitar atribuição'
      };
    }
  },

  async getPendingAssignments() {
    try {
      const { data, error } = await supabase
        .from('class_teachers')
        .select(`
          status,
          classes (
            id,
            name,
            grade
          )
        `)
        .eq('teacher_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'PENDING');

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar atribuições pendentes'
      };
    }
  }
};