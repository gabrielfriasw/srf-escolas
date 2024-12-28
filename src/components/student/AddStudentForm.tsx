import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Student } from '../../types';
import { DeleteConfirmationModal } from '../modals/DeleteConfirmationModal';

interface AddStudentFormProps {
  onAddStudent: (student: Omit<Student, 'id' | 'position'>) => void;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({ onAddStudent }) => {
  const [newStudent, setNewStudent] = useState({ name: '', number: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newStudent.name.trim() || !newStudent.number) {
      setError('Por favor, preencha o nome e o número do aluno.');
      return;
    }

    const number = parseInt(newStudent.number);
    if (isNaN(number)) {
      setError('O número do aluno deve ser válido.');
      return;
    }

    onAddStudent({
      name: newStudent.name.trim(),
      number,
    });
    setNewStudent({ name: '', number: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Adicionar Aluno
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={newStudent.name}
          onChange={(e) =>
            setNewStudent({ ...newStudent, name: e.target.value })
          }
          placeholder="Nome do aluno"
          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <input
          type="number"
          value={newStudent.number}
          onChange={(e) =>
            setNewStudent({ ...newStudent, number: e.target.value })
          }
          placeholder="Nº"
          className="w-full sm:w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
        />
        <button
          type="submit"
          className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar
        </button>
      </form>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};