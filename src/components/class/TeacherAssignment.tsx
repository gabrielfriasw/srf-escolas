import React, { useState } from 'react';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';
import { socketService } from '../../lib/socket/socket.service';

interface TeacherAssignmentProps {
  classId: string;
  teachers: string[];
}

export const TeacherAssignment: React.FC<TeacherAssignmentProps> = ({
  classId,
  teachers,
}) => {
  const [teacherEmail, setTeacherEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { assignTeacherToClass, removeTeacherFromClass } = useClassStore();
  const { findUserByEmail } = useAuthStore();

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!teacherEmail.trim()) {
      setError('Por favor, insira o email do professor.');
      return;
    }

    try {
      const teacher = await findUserByEmail(teacherEmail);
      
      if (!teacher) {
        setError('Professor não encontrado.');
        return;
      }

      if (teacher.role !== 'TEACHER') {
        setError('O usuário não é um professor.');
        return;
      }

      assignTeacherToClass(classId, teacher.id);
      socketService.emitUpdate('class_update', { classId, teacherId: teacher.id });
      
      setSuccess('Professor atribuído com sucesso!');
      setTeacherEmail('');
    } catch (error: any) {
      setError(error.message || 'Erro ao atribuir professor.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mt-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Atribuir Professor
      </h2>
      
      <form onSubmit={handleAssignTeacher} className="space-y-4">
        <div>
          <label htmlFor="teacherEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email do Professor
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="email"
              id="teacherEmail"
              value={teacherEmail}
              onChange={(e) => setTeacherEmail(e.target.value)}
              placeholder="professor@escola.com"
              className="flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="submit"
              className="ml-3 inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Adicionar
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {success && (
          <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
        )}
      </form>
    </div>
  );
};