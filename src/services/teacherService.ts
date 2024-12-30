import { supabase } from '../lib/supabase/client';

export const teacherService = {
  async assignTeacher(classId: string, teacherEmail: string) {
    try {
      // Primeiro, verificamos se o email existe e é único
      const { data: teachers, error: teacherQueryError } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', teacherEmail.toLowerCase())
        .eq('role', 'TEACHER');

      if (teacherQueryError) throw teacherQueryError;
      
      if (!teachers || teachers.length === 0) {
        return { 
          success: false, 
          error: 'Professor não encontrado com este email' 
        };
      }
      
      if (teachers.length > 1) {
        return { 
          success: false, 
          error: 'Múltiplos professores encontrados com este email' 
        };
      }

      const teacher = teachers[0];

      // Verifica se já existe uma atribuição
      const { data: existingAssignment } = await supabase
        .from('class_teachers')
        .select('status')
        .eq('class_id', classId)
        .eq('teacher_id', teacher.id)
        .maybeSingle();

      if (existingAssignment) {
        return {
          success: false,
          error: 'Este professor já está atribuído a esta turma'
        };
      }

      // Cria a nova atribuição
      const { error: assignError } = await supabase
        .from('class_teachers')
        .insert({
          class_id: classId,
          teacher_id: teacher.id,
          status: 'PENDING'
        });

      if (assignError) throw assignError;

      return { 
        success: true,
        message: 'Professor atribuído com sucesso'
      };
    } catch (error: any) {
      console.error('Erro ao atribuir professor:', error);
      return { 
        success: false, 
        error: 'Erro ao atribuir professor. Por favor, tente novamente.'
      };
    }
  },

  async getPendingAssignments() {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

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
        .eq('teacher_id', user.user.id)
        .eq('status', 'PENDING');

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      console.error('Erro ao buscar atribuições pendentes:', error);
      return {
        success: false,
        error: 'Erro ao buscar atribuições pendentes'
      };
    }
  },

  async acceptAssignment(classId: string) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('class_teachers')
        .update({ status: 'ACCEPTED' })
        .eq('class_id', classId)
        .eq('teacher_id', user.user.id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao aceitar atribuição:', error);
      return {
        success: false,
        error: 'Erro ao aceitar atribuição'
      };
    }
  },

  async rejectAssignment(classId: string) {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuário não autenticado');

      const { error } = await supabase
        .from('class_teachers')
        .update({ status: 'REJECTED' })
        .eq('class_id', classId)
        .eq('teacher_id', user.user.id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Erro ao rejeitar atribuição:', error);
      return {
        success: false,
        error: 'Erro ao rejeitar atribuição'
      };
    }
  }
};