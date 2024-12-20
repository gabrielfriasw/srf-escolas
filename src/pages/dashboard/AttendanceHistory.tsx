import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useClassStore } from '../../store/useClassStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';

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

  // Gera array com últimos 12 meses
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

      {stats ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Resumo do Mês
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Total de faltas: {stats.totalAbsences}
            </p>
          </div>

          <div>
            <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
              Faltas por Aluno
            </h3>
            <div className="space-y-3">
              {stats.students.map((student) => {
                const studentData = classData.students.find((s) => s.id === student.id);
                if (!studentData) return null;

                return (
                  <div
                    key={student.id}
                    className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mr-2">
                        {studentData.number}.
                      </span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {studentData.name}
                      </span>
                    </div>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">
                      {student.absences} faltas
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhum registro de falta encontrado para este período.
          </p>
        </div>
      )}
    </div>
  );
};