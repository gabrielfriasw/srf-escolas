import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Student } from '../../types';
import { AttendanceButton } from '../AttendanceButton';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';

interface AttendanceListProps {
  students: Student[];
  attendance: Record<string, 'P' | 'F' | null>;
  onAttendanceChange: (studentId: string, status: 'P' | 'F') => void;
  onRemoveStudent: (studentId: string) => void;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  students,
  attendance,
  onAttendanceChange,
  onRemoveStudent,
}) => {
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);

  // Marca todos os alunos como presentes
  const markAllPresent = () => {
    students.forEach((student) => {
      onAttendanceChange(student.id, 'P');
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">
            Lista de Alunos
          </h2>
          <button
            onClick={markAllPresent}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
          >
            Marcar Todos Presentes
          </button>
        </div>
        <div className="space-y-4">
          {students
            .sort((a, b) => a.number - b.number)
            .map((student) => (
              <div
                key={student.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg gap-4"
              >
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400 w-8">
                    {student.number}
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 break-words flex-1">
                    {student.name}
                  </span>
                </div>
                <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center space-x-2">
                    <AttendanceButton
                      status="P"
                      isActive={attendance[student.id] === 'P'}
                      onClick={() => onAttendanceChange(student.id, 'P')}
                    />
                    <AttendanceButton
                      status="F"
                      isActive={attendance[student.id] === 'F'}
                      onClick={() => onAttendanceChange(student.id, 'F')}
                    />
                  </div>
                  <button
                    onClick={() => setStudentToDelete(student.id)}
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={() => {
          if (studentToDelete) {
            onRemoveStudent(studentToDelete);
            setStudentToDelete(null);
          }
        }}
        title="Excluir Aluno"
        message="Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita."
      />
    </div>
  );
};