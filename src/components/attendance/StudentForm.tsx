import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Student } from '../../types';

interface StudentFormProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  maxRows: number;
  maxColumns: number;
}

export function StudentForm({ onAddStudent, maxRows, maxColumns }: StudentFormProps) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [row, setRow] = useState('0');
  const [column, setColumn] = useState('0');

  const handleSubmit = () => {
    if (name && rollNumber) {
      onAddStudent({
        name,
        rollNumber,
        position: {
          row: Number(row),
          column: Number(column),
        },
      });
      setName('');
      setRollNumber('');
      setRow('0');
      setColumn('0');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Adicionar Novo Aluno
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Nome do Aluno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Número de Chamada"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          <select
            value={row}
            onChange={(e) => setRow(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {Array.from({ length: maxRows }, (_, i) => (
              <option key={i} value={i}>
                Fileira {i + 1}
              </option>
            ))}
          </select>
          <select
            value={column}
            onChange={(e) => setColumn(e.target.value)}
            className="rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {Array.from({ length: maxColumns }, (_, i) => (
              <option key={i} value={i}>
                Coluna {i + 1}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleSubmit}
          className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Adicionar Aluno
        </button>
      </div>
    </div>
  );
}