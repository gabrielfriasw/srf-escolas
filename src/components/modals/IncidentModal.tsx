import React, { useState } from 'react';
import { Student } from '../../types';

interface IncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  classData: {
    name: string;
    pedagogistPhone: string;
  };
  onSave: (incident: {
    type: string;
    date: string;
    description: string;
  }) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({
  isOpen,
  onClose,
  student,
  classData,
  onSave,
}) => {
  const [type, setType] = useState('Atraso');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ type, date, description });
    
    const message = `Nova Ocorrência - Sala ${classData.name}\nAluno: ${student.name}\nTipo: ${type}\nData: ${date}\nDescrição:\n${description}`;
    
    window.open(
      `https://wa.me/${classData.pedagogistPhone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
    
    onClose();
  };

  if (!isOpen) return null;

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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tipo de Ocorrência
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="Atraso">Atraso</option>
                <option value="Comportamento Inadequado">Comportamento Inadequado</option>
                <option value="Elogio">Elogio</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Descrição
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
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