import React from 'react';
import { Occurrence } from '../../types/occurrence';

interface OccurrenceListProps {
  occurrences: Occurrence[];
  onResend: (occurrence: Occurrence) => void;
}

const getOccurrenceTypeLabel = (type: Occurrence['type']) => {
  switch (type) {
    case 'DELAY':
      return 'Atraso';
    case 'BEHAVIOR':
      return 'Comportamento Inadequado';
    case 'PRAISE':
      return 'Elogio';
    case 'OTHER':
      return 'Outros';
  }
};

export const OccurrenceList: React.FC<OccurrenceListProps> = ({
  occurrences,
  onResend,
}) => {
  return (
    <div className="space-y-4">
      {occurrences.map((occurrence) => (
        <div
          key={occurrence.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-4"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {getOccurrenceTypeLabel(occurrence.type)}
              </span>
              <span className="mx-2">•</span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(occurrence.date).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <button
              onClick={() => onResend(occurrence)}
              className="text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Reenviar
            </button>
          </div>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {occurrence.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Registrado por: {occurrence.teacherName}
          </p>
        </div>
      ))}
    </div>
  );
};