import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { Student } from '../../types';

interface AttendanceModificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (type: 'ARRIVAL' | 'OBSERVATION', details: string) => void;
  student: Student;
  initialCallTime: string;
  teacherName: string;
}

export const AttendanceModificationModal: React.FC<AttendanceModificationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  student,
  initialCallTime,
  teacherName,
}) => {
  const [type, setType] = useState<'ARRIVAL' | 'OBSERVATION'>('ARRIVAL');
  const [details, setDetails] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Adicionar Observação
          </h3>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            A chamada foi realizada às {initialCallTime} pelo Professor {teacherName}.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'ARRIVAL' | 'OBSERVATION')}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="ARRIVAL">Chegada Atrasada</option>
                <option value="OBSERVATION">Observação</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Detalhes
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                rows={3}
                placeholder={type === 'ARRIVAL' ? 'Ex: Aluno chegou às 09:15' : 'Digite sua observação'}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
            >
              Cancelar
            </button>
            <button
              onClick={() => {
                onConfirm(type, details);
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};