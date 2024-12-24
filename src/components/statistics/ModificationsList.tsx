import React from 'react';
import { AttendanceModification } from '../../types';

interface ModificationsListProps {
  modifications: AttendanceModification[];
}

export const ModificationsList: React.FC<ModificationsListProps> = ({ modifications }) => {
  return (
    <div className="mt-3">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Observações:
      </h4>
      <div className="space-y-2">
        {modifications.map(mod => (
          <div
            key={mod.id}
            className="text-sm bg-primary-50 dark:bg-primary-900/50 p-2 rounded"
          >
            <div className="flex justify-between text-primary-700 dark:text-primary-300">
              <span>{new Date(mod.timestamp).toLocaleString('pt-BR')}</span>
              <span>{mod.userName}</span>
            </div>
            <p className="mt-1 text-gray-700 dark:text-gray-300">
              {mod.type === 'ARRIVAL' ? '🕒 Chegada: ' : '📝 Observação: '}
              {mod.details}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};