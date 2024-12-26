import React from 'react';
import { Student } from '../../types';

interface StudentIncidentsProps {
  student: Student;
  pedagogistPhone: string;
  className: string;
}

export const StudentIncidents: React.FC<StudentIncidentsProps> = ({
  student,
  pedagogistPhone,
  className,
}) => {
  const handleResend = (incident: Student['incidents'][0]) => {
    const message = `Nova Ocorrência - Sala ${className}\nAluno: ${student.name}\nTipo: ${incident.type}\nData: ${incident.date}\nDescrição:\n${incident.description}`;
    
    window.open(
      `https://wa.me/${pedagogistPhone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="mt-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
        Histórico de Ocorrências
      </h3>
      
      {student.incidents.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          Nenhuma ocorrência registrada.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {student.incidents.map((incident) => (
                <tr key={incident.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {incident.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {new Date(incident.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                    {incident.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleResend(incident)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Reenviar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};