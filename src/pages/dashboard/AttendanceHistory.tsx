import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClassStore } from '../../store/useClassStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { ClassStatistics } from '../../components/statistics/ClassStatistics';

export const AttendanceHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { classes } = useClassStore();
  const { getMonthlyStats } = useAttendanceStore();
  const classData = classes.find((c) => c.id === id);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  if (!classData) {
    return <div>Turma não encontrada</div>;
  }

  const stats = getMonthlyStats(id!, selectedMonth, selectedYear);

  // Generate last 12 months array
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return {
      value: date.getMonth(),
      year: date.getFullYear(),
      label: date.toLocaleString('pt-BR', { month: 'long', year: 'numeric' }),
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Histórico de Faltas - {classData.name}
        </h1>
        <select
          value={`${selectedYear}-${selectedMonth}`}
          onChange={(e) => {
            const [year, month] = e.target.value.split('-').map(Number);
            setSelectedYear(year);
            setSelectedMonth(month);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white"
        >
          {months.map((month) => (
            <option
              key={`${month.year}-${month.value}`}
              value={`${month.year}-${month.value}`}
            >
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <ClassStatistics classData={classData} />
    </div>
  );
};