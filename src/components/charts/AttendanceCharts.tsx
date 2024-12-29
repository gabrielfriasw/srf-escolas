import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { AttendanceStats } from '../../types';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface AttendanceChartsProps {
  stats: AttendanceStats;
  monthlyData: {
    labels: string[];
    attendance: number[];
  };
}

export const AttendanceCharts: React.FC<AttendanceChartsProps> = ({
  stats,
  monthlyData,
}) => {
  // Pie Chart Data
  const pieData = {
    labels: ['Presença', 'Faltas'],
    datasets: [
      {
        data: [stats.averageAttendance, 100 - stats.averageAttendance],
        backgroundColor: ['#22c55e', '#ef4444'],
      },
    ],
  };

  // Bar Chart Data - Top 10 students by attendance
  const barData = {
    labels: stats.students.slice(0, 10).map(s => s.name),
    datasets: [
      {
        label: 'Faltas',
        data: stats.students.slice(0, 10).map(s => s.absences),
        backgroundColor: '#3b82f6',
      },
    ],
  };

  // Line Chart Data - Monthly evolution
  const lineData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Frequência (%)',
        data: monthlyData.attendance,
        borderColor: '#3b82f6',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            Distribuição de Presenças
          </h3>
          <Pie data={pieData} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            Top 10 Alunos - Faltas
          </h3>
          <Bar data={barData} />
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
            Evolução da Frequência
          </h3>
          <Line data={lineData} />
        </div>
      </div>
    </div>
  );
};