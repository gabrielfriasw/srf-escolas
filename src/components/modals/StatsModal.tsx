import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AttendanceCharts } from '../charts/AttendanceCharts';
import { StatisticsHeader } from '../statistics/StatisticsHeader';
import { AttendanceStats } from '../../types';
import { useRealtimeStats } from '../../hooks/useRealtimeStats';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string; // Adicionado classId
  stats: AttendanceStats;
  monthlyData: {
    labels: string[];
    attendance: number[];
  };
  onPeriodChange: (period: string) => void;
  onShiftChange: (shift: string) => void;
  onExportPDF: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  classId,
  stats,
  monthlyData,
  onPeriodChange,
  onShiftChange,
  onExportPDF,
}) => {
  // Usar o hook de atualização em tempo real
  useRealtimeStats(classId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white dark:bg-gray-800 rounded-lg w-full max-w-6xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Estatísticas de Frequência
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <StatisticsHeader
              stats={stats}
              onPeriodChange={onPeriodChange}
              onShiftChange={onShiftChange}
              onExportPDF={onExportPDF}
            />

            <AttendanceCharts
              stats={stats}
              monthlyData={monthlyData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};