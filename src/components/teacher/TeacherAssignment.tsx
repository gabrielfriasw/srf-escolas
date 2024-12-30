import React, { useState } from 'react';
import { useTeacherAssignment } from '../../hooks/useTeacherAssignment';

interface TeacherAssignmentProps {
  classId: string;
}

export const TeacherAssignment: React.FC<TeacherAssignmentProps> = ({ classId }) => {
  const [teacherEmail, setTeacherEmail] = useState('');
  const [success, setSuccess] = useState('');
  const { assignTeacher, loading, error } = useTeacherAssignment();

  const handleAssignTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');

    if (!teacherEmail.trim()) {
      return;
    }

    const result = await assignTeacher(classId, teacherEmail);
    
    if (result) {
      setSuccess('Professor atribuído com sucesso!');
      setTeacherEmail('');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mt-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Atribuir Professor
      </h2>
      <form onSubmit={handleAssignTeacher} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          value={teacherEmail}
          onChange={(e) => setTeacherEmail(e.target.value)}
          placeholder="Email do professor"
          disabled={loading}
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Atribuindo...' : 'Atribuir Professor'}
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {success && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">{success}</p>
      )}
    </div>
  );
};