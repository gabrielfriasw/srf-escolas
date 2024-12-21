import React from 'react';
import { Student } from '../../types';
import { AttendanceButton } from '../AttendanceButton';

interface StudentDeskProps {
  student: Student;
  position: { x: number; y: number };
  attendance: 'P' | 'F' | null;
  onAttendanceChange: (status: 'P' | 'F') => void;
  onDragStart: (e: React.DragEvent) => void;
  onDrag: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  deskDimensions: { width: number; height: number };
}

export const StudentDesk: React.FC<StudentDeskProps> = ({
  student,
  position,
  attendance,
  onAttendanceChange,
  onDragStart,
  onDrag,
  onDragEnd,
  isDragging,
  deskDimensions,
}) => {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: deskDimensions.width,
        height: 'auto',
        minHeight: deskDimensions.height,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      className={`
        bg-white dark:bg-gray-800 
        rounded-lg shadow-md 
        border-2 border-gray-200 dark:border-gray-700
        ${isDragging ? 'z-50 opacity-90' : 'z-0'}
        transition-shadow hover:shadow-lg
      `}
    >
      <div className="h-full p-3 flex flex-col justify-between">
        <div className="text-sm font-medium text-gray-900 dark:text-white break-words">
          {student.number}. {student.name}
        </div>
        <div className="flex justify-center space-x-2 mt-2">
          <AttendanceButton
            status="P"
            isActive={attendance === 'P'}
            onClick={() => onAttendanceChange('P')}
          />
          <AttendanceButton
            status="F"
            isActive={attendance === 'F'}
            onClick={() => onAttendanceChange('F')}
          />
        </div>
      </div>
    </div>
  );
};