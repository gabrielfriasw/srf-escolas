import { Student } from '../../types';
import { Check, X } from 'lucide-react';

interface AttendanceListProps {
  students: Student[];
  absentStudents: Set<string>;
  onAttendanceChange: (studentId: string) => void;
}

export function AttendanceList({ 
  students, 
  absentStudents, 
  onAttendanceChange 
}: AttendanceListProps) {
  const sortedStudents = [...students].sort((a, b) => 
    Number(a.rollNumber) - Number(b.rollNumber)
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {sortedStudents.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-200"
        >
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {student.rollNumber}. {student.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onAttendanceChange(student.id)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                !absentStudents.has(student.id)
                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Check className="h-5 w-5" />
            </button>
            <button
              onClick={() => onAttendanceChange(student.id)}
              className={`p-2 rounded-full transition-colors duration-200 ${
                absentStudents.has(student.id)
                  ? 'bg-red-100 text-red-600 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}