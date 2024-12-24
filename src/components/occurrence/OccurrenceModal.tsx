import React, { useState } from 'react';
import { Student } from '../../types';
import { OccurrenceType } from '../../types/occurrence';

interface OccurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: OccurrenceType;
    date: string;
    description: string;
  }) => void;
  student: Student;
}

export const OccurrenceModal: React.FC<OccurrenceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
}) => {
  const [type, setType] = useState<OccurrenceType>('DELAY');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type, date, description });
    setType('DELAY');
    setDate(new Date().toISOString().split('T')[0]);
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Registrar Ocorrência - {student.name}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de Ocorrência
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OccurrenceType)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="DELAY">Atraso</option>
                <option value="BEHAVIOR">Comportamento Inadequado</option>
                <option value="PRAISE">Elogio</option>
                <option value="OTHER">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md hover:bg-gray-700"
              >
                Enviar Ocorrência
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};