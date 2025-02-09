import { supabase } from '../supabase';
import type { ExamSession, ExamAllocation, ExamAttendance, ExamSeating } from '../../../types/exam';
import type { Student } from '../../../types/student';
import type { Class } from '../../../types/class';

export const examService = {
  // Sessões
  createSession: async (session: Omit<ExamSession, 'id' | 'created_at' | 'updated_at'>) => {
    console.log('Creating exam session with data:', session);
    
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .insert(session)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error creating session:', error);
        throw new Error(`Erro ao criar sessão: ${error.message}`);
      }

      if (!data) {
        throw new Error('Sessão criada mas nenhum dado retornado');
      }

      console.log('Successfully created session:', data);
      return data;
    } catch (error) {
      console.error('Error in createSession:', error);
      throw error;
    }
  },

  deleteSession: async (sessionId: string) => {
    try {
      // Delete all related records (this will happen automatically due to ON DELETE CASCADE)
      const { error } = await supabase
        .from('exam_sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) {
        console.error('Error deleting session:', error);
        throw new Error(`Erro ao excluir sessão: ${error.message}`);
      }
    } catch (error) {
      console.error('Error in deleteSession:', error);
      throw error;
    }
  },

  getSessions: async () => {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          exam_allocations (
            *,
            students (*),
            classes (*)
          ),
          exam_attendance (
            *,
            students (*)
          ),
          exam_seating (
            *,
            students (*)
          )
        `)
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching sessions:', error);
        throw error;
      }

      console.log('Fetched sessions:', data);
      return data;
    } catch (error) {
      console.error('Error in getSessions:', error);
      throw error;
    }
  },

  getSessionDetails: async (sessionId: string): Promise<ExamSession | null> => {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select(`
          *,
          exam_allocations (
            *,
            student:students (*),
            original_class:classes (*)
          )
        `)
        .eq('id', sessionId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting session details:', error);
      throw error;
    }
  },

  // Verificar alunos já alocados
  getAllocatedStudents: async (date: string): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('exam_sessions')
        .select(`
          id,
          exam_allocations (
            student_id
          )
        `)
        .eq('date', date);

      if (error) throw error;

      // Extrair IDs únicos dos alunos já alocados
      const allocatedIds = new Set<string>();
      data?.forEach(session => {
        session.exam_allocations?.forEach((allocation: any) => {
          allocatedIds.add(allocation.student_id);
        });
      });

      return Array.from(allocatedIds);
    } catch (error) {
      console.error('Error getting allocated students:', error);
      throw error;
    }
  },

  // Atualizar informações do aluno no ensalamento
  updateStudentAllocation: async (
    sessionId: string,
    studentId: string,
    updates: {
      temp_name?: string;
      temp_number?: number;
    }
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('exam_allocations')
        .update(updates)
        .eq('exam_session_id', sessionId)
        .eq('student_id', studentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating student allocation:', error);
      throw error;
    }
  },

  // Alocações
  distributeStudents: async (sessionId: string, selectedClasses: Class[]): Promise<ExamAllocation[]> => {
    try {
      // 1. Obter alunos já alocados na mesma data
      const session = await examService.getSessionDetails(sessionId);
      const existingAllocations = await examService.getAllocatedStudents(session.date);

      // 2. Coletar todos os alunos das turmas selecionadas (excluindo já alocados)
      const allStudents = selectedClasses.flatMap(c => 
        (c.students || [])
          .filter(s => !existingAllocations.includes(s.id))
          .map(s => ({
            id: s.id,
            name: s.name,
            number: s.number,
            classId: c.id,
            className: c.name
          }))
      );

      // 3. Embaralhar aleatoriamente os alunos
      const shuffledStudents = [...allStudents].sort(() => Math.random() - 0.5);

      // 4. Distribuir alunos seguindo as regras:
      // - Máximo 2 alunos da mesma turma
      // - Máximo 40 alunos no total
      // - Tentar distribuir igualmente entre as turmas
      const selectedStudents: typeof shuffledStudents = [];
      const studentsPerClass: Record<string, number> = {};
      const maxStudentsPerClass = 2;
      const maxTotalStudents = 40;

      // Primeiro, alocar um aluno de cada turma
      for (const student of shuffledStudents) {
        if (selectedStudents.length >= maxTotalStudents) break;
        
        if (!studentsPerClass[student.classId]) {
          studentsPerClass[student.classId] = 1;
          selectedStudents.push(student);
        }
      }

      // Depois, tentar alocar o segundo aluno de cada turma
      for (const student of shuffledStudents) {
        if (selectedStudents.length >= maxTotalStudents) break;
        if (selectedStudents.some(s => s.id === student.id)) continue;
        
        if (studentsPerClass[student.classId] < maxStudentsPerClass) {
          studentsPerClass[student.classId]++;
          selectedStudents.push(student);
        }
      }

      // Ordenar por turma e número
      selectedStudents.sort((a, b) => {
        const classCompare = a.className.localeCompare(b.className);
        if (classCompare !== 0) return classCompare;
        return a.number - b.number;
      });

      // 5. Criar as alocações no banco
      const { data: allocations, error } = await supabase
        .from('exam_allocations')
        .insert(
          selectedStudents.map(student => ({
            exam_session_id: sessionId,
            student_id: student.id,
            original_class_id: student.classId
          }))
        )
        .select(`
          *,
          student:students (*),
          original_class:classes (*)
        `);

      if (error) throw error;
      return allocations;

    } catch (error) {
      console.error('Error distributing students:', error);
      throw error;
    }
  },

  // Chamada
  takeAttendance: async (
    sessionId: string,
    date: string,
    attendance: Array<{
      student_id: string;
      status: 'present' | 'absent' | 'late';
    }>
  ): Promise<void> => {
    try {
      // Obter o usuário atual
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      // 1. Deletar registros existentes
      const { error: deleteError } = await supabase
        .from('exam_attendance')
        .delete()
        .eq('exam_session_id', sessionId)
        .eq('date', date);

      if (deleteError) throw deleteError;

      // 2. Inserir novos registros
      const { error: insertError } = await supabase
        .from('exam_attendance')
        .insert(
          attendance.map(record => ({
            exam_session_id: sessionId,
            student_id: record.student_id,
            status: record.status,
            date: date,
            owner_id: user.id
          }))
        );

      if (insertError) throw insertError;
    } catch (error) {
      console.error('Error taking attendance:', error);
      throw error;
    }
  },

  getAttendance: async (sessionId: string, date: string): Promise<ExamAttendance[]> => {
    try {
      const { data, error } = await supabase
        .from('exam_attendance')
        .select(`
          *,
          student:students (*)
        `)
        .eq('exam_session_id', sessionId)
        .eq('date', date);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting attendance:', error);
      throw error;
    }
  },

  // Espelho de Classe
  updateSeating: async (
    sessionId: string,
    seating: Array<{ student_id: string; position_x: number; position_y: number }>
  ): Promise<ExamSeating[]> => {
    try {
      // Primeiro, remover posições existentes
      const { error: deleteError } = await supabase
        .from('exam_seating')
        .delete()
        .eq('exam_session_id', sessionId);

      if (deleteError) throw deleteError;

      // Inserir novas posições
      const { data: positions, error: insertError } = await supabase
        .from('exam_seating')
        .insert(
          seating.map(position => ({
            exam_session_id: sessionId,
            student_id: position.student_id,
            position_x: position.position_x,
            position_y: position.position_y
          }))
        )
        .select();

      if (insertError) throw insertError;

      return positions;
    } catch (error) {
      console.error('Error updating seating:', error);
      throw error;
    }
  },

  getSeating: async (sessionId: string): Promise<ExamSeating[]> => {
    try {
      const { data, error } = await supabase
        .from('exam_seating')
        .select(`
          *,
          student:students (*)
        `)
        .eq('exam_session_id', sessionId);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting seating:', error);
      throw error;
    }
  }
};