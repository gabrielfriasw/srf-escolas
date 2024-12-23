import React from 'react';
import { AttendanceStats, Student } from '../../types';
import { ModificationsList } from './ModificationsList';

interface StudentStatsListProps {
  stats: AttendanceStats;
  students: Student[];
}

export const StudentStatsList: React.FC<StudentStatsListProps> = ({ stats, students }) => {
  return (
    <div className="space-y-4">
      {stats.students.map(studentStats => {
        const student = students.find(s => s.id === studentStats.id);
        if (!student) return null;

        return (
          <div key={student.id} className="border dark:border-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {student.number}. {student.name}
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Total de faltas: {studentStats.absences}
                </p>
              </div>
            </div>
            
            {studentStats.absenceDates.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Datas das faltas:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {studentStats.absenceDates.map(date => (
                    <span
                      key={date}
                      className="text-sm bg-primary-100 dark:bg-primary-800 text-primary-800 dark:text-primary-200 px-2 py-1 rounded"
                    >
                      {new Date(date).toLocaleDateString('pt-BR')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {studentStats.modifications.length > 0 && (
              <ModificationsList modifications={studentStats.modifications} />
            )}
          </div>
        );
      })}
    </div>
  );
};