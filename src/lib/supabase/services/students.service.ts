import { supabase } from '../supabase';
import type { Student, Position } from '../../../types';

export const studentsService = {
  addStudent: async (classId: string, student: Omit<Student, 'id' | 'incidents'>) => {
    const { data, error } = await supabase
      .from('students')
      .insert({
        class_id: classId,
        name: student.name,
        number: student.number,
        position_x: student.position?.x,
        position_y: student.position?.y,
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  updateStudentPosition: async (studentId: string, position: Position) => {
    const { data, error } = await supabase
      .from('students')
      .update({
        position_x: position.x,
        position_y: position.y,
      })
      .eq('id', studentId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  removeStudent: async (studentId: string) => {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', studentId);
    
    if (error) throw error;
  },
};