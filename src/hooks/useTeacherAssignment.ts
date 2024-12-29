import { useState } from 'react';
import { teacherService } from '../services/teacherService';

export const useTeacherAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assignTeacher = async (classId: string, teacherEmail: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await teacherService.assignTeacher(classId, teacherEmail);
      
      if (!result.success) {
        setError(result.error);
        return false;
      }
      
      return true;
    } catch (err) {
      setError('Erro ao atribuir professor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { assignTeacher, loading, error };
};