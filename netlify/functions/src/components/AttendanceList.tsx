import React from 'react';
import { Student } from '../types/student';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { Edit2 } from 'lucide-react';

interface AttendanceListProps {
  students: Student[];
  attendance: Record<string, 'present' | 'absent'>;
  onAttendanceChange: (studentId: string, status: 'present' | 'absent') => void;
  showClass?: boolean;
  onEditStudent?: (student: Student) => void;
}

export const AttendanceList: React.FC<AttendanceListProps> = ({
  students,
  attendance,
  onAttendanceChange,
  showClass = false,
  onEditStudent
}) => {
  const sortedStudents = [...students].sort((a, b) => {
    if (showClass) {
      const classCompare = a.className.localeCompare(b.className);
      if (classCompare !== 0) return classCompare;
    }
    return a.number - b.number;
  });

  return (
    <div className="space-y-2">
      {sortedStudents.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-4">
            <span className="font-medium w-8">{student.number}</span>
            <span>{student.name}</span>
            {showClass && (
              <span className="text-sm text-gray-500">{student.className}</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {onEditStudent && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditStudent(student)}
                className="px-2"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5 space-x-0.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAttendanceChange(student.id, 'present')}
                className={cn(
                  'px-3 rounded-md',
                  attendance[student.id] === 'present' && 'bg-green-100 hover:bg-green-200'
                )}
              >
                P
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAttendanceChange(student.id, 'absent')}
                className={cn(
                  'px-3 rounded-md',
                  attendance[student.id] === 'absent' && 'bg-red-100 hover:bg-red-200'
                )}
              >
                F
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
