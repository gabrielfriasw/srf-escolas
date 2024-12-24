import React from 'react';
import { FileDown } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { generatePDF } from '../../utils/pdfGenerator';
import { StudentStatsList } from './StudentStatsList';
import { Class } from '../../types';

interface ClassStatisticsProps {
  classData: Class;
}

export const ClassStatistics: React.FC<ClassStatisticsProps> = ({ classData }) => {
  const user = useAuthStore(state => state.user);
  const { getDetailedStats } = useAttendanceStore();
  const stats = getDetailedStats(classData.id);

  const handleExportPDF = () => {
    if (!user || !stats) return;

    const report = {
      className: classData.name,
      grade: classData.grade,
      generatedBy: user.name,
      generatedAt: new Date().toISOString(),
      students: stats.students.map(student => ({
        number: classData.students.find(s => s.id === student.id)?.number || 0,
        name: classData.students.find(s => s.id === student.id)?.name || '',
        totalAbsences: student.absences,
        absenceDates: student.absenceDates,
        modifications: student.modifications,
      })),
    };

    generatePDF(report);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Estatísticas da Sala
        </h2>
        <button
          onClick={handleExportPDF}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          <FileDown className="h-5 w-5" />
          <span>Exportar PDF</span>
        </button>
      </div>
      
      {stats ? (
        <StudentStatsList stats={stats} students={classData.students} />
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Nenhum registro de falta encontrado.
        </p>
      )}
    </div>
  );
};