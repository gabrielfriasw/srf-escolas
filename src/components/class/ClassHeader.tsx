import React from 'react';
import { FileText, Users, Send } from 'lucide-react';

interface ClassHeaderProps {
  name: string;
  grade: string;
  onSendAttendance: () => void;
  onToggleClassroom: () => void;
  onNavigateHistory: () => void;
}

export const ClassHeader: React.FC<ClassHeaderProps> = ({
  name,
  grade,
  onSendAttendance,
  onToggleClassroom,
  onNavigateHistory,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {name}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{grade}</p>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onSendAttendance}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Send className="h-5 w-5" />
          <span>Enviar Registro</span>
        </button>

        <button
          onClick={onToggleClassroom}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Users className="h-5 w-5" />
          <span>Espelho de Classe</span>
        </button>

        <button
          onClick={onNavigateHistory}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
        >
          <FileText className="h-5 w-5" />
          <span>Histórico</span>
        </button>
      </div>
    </div>
  );
};