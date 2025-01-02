import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useClassStore } from '../../store/useClassStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { AttendanceCharts } from '../../components/charts/AttendanceCharts';
import { StatisticsHeader } from '../../components/statistics/StatisticsHeader';
import { exportStatsToPDF } from '../../utils/pdfExport';

export const AttendanceHistory: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { classes } = useClassStore();
  const { getMonthlyStats, fetchAttendance } = useAttendanceStore();
  const classData = classes.find((c) => c.id === id);
  
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedShift, setSelectedShift] = useState(classData?.shift || 'morning');

  const [monthlyData, setMonthlyData] = useState({
    labels: [] as string[],
    attendance: [] as number[],
  });

  useEffect(() => {
    if (id) {
      fetchAttendance(id);
    }
  }, [id, fetchAttendance]);

  useEffect(() => {
    if (classData) {
      // Generate last 6 months data for the line chart
      const data = {
        labels: [] as string[],
        attendance: [] as number[],
      };

      for (let i = 5; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const stats = getMonthlyStats(id!, date.getMonth(), date.getFullYear(), selectedShift);
        
        if (stats) {
          data.labels.push(date.toLocaleString('pt-BR', { month: 'short' }));
          data.attendance.push(stats.averageAttendance);
        }
      }

      setMonthlyData(data);
    }
  }, [id, selectedShift, classData, getMonthlyStats]);

  if (!classData) {
    return <div>Turma não encontrada</div>;
  }

  const stats = getMonthlyStats(id!, selectedMonth, selectedYear, selectedShift);

  const handleExportPDF = () => {
    if (stats) {
      exportStatsToPDF(
        stats,
        classData.name,
        `${stats.month} ${stats.year}`
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Histórico de Faltas - {classData.name}
      </h1>

      {stats ? (
        <>
          <StatisticsHeader
            stats={stats}
            onPeriodChange={setSelectedPeriod}
            onShiftChange={setSelectedShift}
            onExportPDF={handleExportPDF}
          />

          <AttendanceCharts
            stats={stats}
            monthlyData={monthlyData}
          />

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Detalhamento por Aluno
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Faltas
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {stats.students.map((student) => {
                    const studentData = classData.students.find(
                      (s) => s.id === student.id
                    );
                    if (!studentData) return null;

                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {studentData.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {student.absences}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
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