import React from 'react';
import { AttendanceStats } from '../../types';
import { FileDown, Calendar, Clock } from 'lucide-react';

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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm">
          <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
            Frequência Média
          </h4>
          <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
            {stats.averageAttendance.toFixed(1)}%
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm">
          <h4 className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
            Total de Faltas
          </h4>
          <p className="text-3xl font-bold text-red-700 dark:text-red-300">
            {Math.floor(stats.totalAbsences / 2)}
          </p>
        </div>

        <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-sm">
          <h4 className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
            Melhor Frequência
          </h4>
          <p className="text-3xl font-bold text-green-700 dark:text-green-300 truncate">
            {stats.students[0]?.name || 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-xl shadow-sm">
          <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            onChange={(e) => onPeriodChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
          >
            <option value="monthly">Mensal</option>
            <option value="quarterly">Trimestral</option>
            <option value="yearly">Anual</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-gray-700 px-4 py-2 rounded-xl shadow-sm">
          <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <select
            onChange={(e) => onShiftChange(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-gray-700 dark:text-gray-300"
          >
            <option value="morning">Matutino</option>
            <option value="afternoon">Vespertino</option>
            <option value="night">Noturno</option>
          </select>
        </div>

        <button
          onClick={onExportPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-900 transition-all transform hover:scale-105 active:scale-95 duration-200"
        >
          <FileDown className="w-5 h-5" />
          <span>Exportar PDF</span>
        </button>
      </div>
    </div>
  );
};