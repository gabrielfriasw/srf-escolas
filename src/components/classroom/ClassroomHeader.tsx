import React from 'react';

interface ClassroomHeaderProps {
  onSave: () => void;
  onClose: () => void;
}

export const ClassroomHeader: React.FC<ClassroomHeaderProps> = ({
  onSave,
  onClose,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">
        Espelho de Classe
      </h2>
      <div className="flex space-x-4 w-full sm:w-auto">
        <button
          onClick={onSave}
          className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
        >
          Salvar
        </button>
        <button
          onClick={onClose}
          className="flex-1 sm:flex-none px-4 py-2 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 text-sm sm:text-base"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};