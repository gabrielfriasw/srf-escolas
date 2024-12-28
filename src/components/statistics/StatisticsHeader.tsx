import React from 'react';
import { AttendanceStats } from '../../types';

interface StatisticsHeaderProps {
  stats: AttendanceStats;
  onPeriodChange: (period: string) => void;
  onShiftChange: (shift: string) => void;
  onExportPDF: () => void;
}

export const StatisticsHeader: React.FC<StatisticsHeaderProps> = ({
  stats,
  onPeriodChange,
  onShiftChange,
  onExportPDF,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Frequência Média
          </h4>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
            {stats.averageAttendance.toFixed(1)}%
          </p>
        </div>

        <div className="p-4 bg-red-50 dark:bg-red-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400">
            Total de Faltas
          </h4>
          <p className="text-2xl font-bold text-red-700 dark:text-red-300">
            {Math.floor(stats.totalAbsences / 2)}
          </p>
        </div>

        <div className="p-4 bg-green-50 dark:bg-green-900/50 rounded-lg">
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400">
            Melhor Frequência
          </h4>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">
            {stats.students[0]?.name || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <select
          onChange={(e) => onPeriodChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        >
          <option value="monthly">Mensal</option>
          <option value="quarterly">Trimestral</option>
          <option value="yearly">Anual</option>
        </select>

        <select
          onChange={(e) => onShiftChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
        >
          <option value="morning">Matutino</option>
          <option value="afternoon">Vespertino</option>
          <option value="night">Noturno</option>
        </select>

        <button
          onClick={onExportPDF}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
};