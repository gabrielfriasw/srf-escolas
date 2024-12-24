import React, { useState } from 'react';
import { Trash2, AlertCircle } from 'lucide-react';
import { Student } from '../../types';
import { AttendanceButton } from '../AttendanceButton';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';
import { OccurrenceModal } from '../occurrence/OccurrenceModal';
import { useOccurrenceStore } from '../../store/useOccurrenceStore';
import { useAuthStore } from '../../store/useAuthStore';

interface AttendanceListProps {
  students: Student[];
  attendance: Record<string, 'P' | 'F' | null>;
  onAttendanceChange: (studentId: string, status: 'P' | 'F') => void;
  onRemoveStudent: (studentId: string) => void;
  classId: string;
  pedagogistPhone: string;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  students,
  attendance,
  onAttendanceChange,
  onRemoveStudent,
  classId,
  pedagogistPhone,
}) => {
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const addOccurrence = useOccurrenceStore((state) => state.addOccurrence);
  const user = useAuthStore((state) => state.user);

  const handleOccurrenceSubmit = (data: {
    type: 'DELAY' | 'BEHAVIOR' | 'PRAISE' | 'OTHER';
    date: string;
    description: string;
  }) => {
    if (!selectedStudent || !user) return;

    const occurrence = {
      ...data,
      studentId: selectedStudent.id,
      classId,
      teacherId: user.id,
      teacherName: user.name,
    };

    addOccurrence(occurrence);

    const message = `*Nova Ocorrência - ${selectedStudent.name}*\n\n` +
      `👤 Aluno: ${selectedStudent.number}. ${selectedStudent.name}\n` +
      `📝 Tipo: ${data.type === 'DELAY' ? 'Atraso' : 
                  data.type === 'BEHAVIOR' ? 'Comportamento Inadequado' :
                  data.type === 'PRAISE' ? 'Elogio' : 'Outros'}\n` +
      `📅 Data: ${new Date(data.date).toLocaleDateString('pt-BR')}\n\n` +
      `📋 Descrição:\n${data.description}\n\n` +
      `👨‍🏫 Registrado por: ${user.name}\n\n` +
      `_Sistema de Registro de Faltas_`;

    const whatsappUrl = `https://wa.me/${pedagogistPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setSelectedStudent(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-4 sm:p-6">
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
                    <button
                      onClick={() => setSelectedStudent(student)}
                      className="p-2 text-gray-600 hover:text-gray-700 dark:text-gray-400"
                      title="Registrar Ocorrência"
                    >
                      <AlertCircle className="h-5 w-5" />
                    </button>
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

      {selectedStudent && (
        <OccurrenceModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSubmit={handleOccurrenceSubmit}
          student={selectedStudent}
        />
      )}
    </div>
  );
};