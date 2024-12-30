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
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onDragEnd: () => void;
  onTouchEnd: () => void;
  isDragging: boolean;
  isTouchDevice: boolean;
  deskDimensions: { width: number; height: number };
}

export const StudentDesk: React.FC<StudentDeskProps> = ({
  student,
  position,
  attendance,
  onAttendanceChange,
  onDragStart,
  onDrag,
  onTouchStart,
  onTouchMove,
  onDragEnd,
  onTouchEnd,
  isDragging,
  isTouchDevice,
  deskDimensions,
}) => {
  return (
    <div
      draggable={!isTouchDevice}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: deskDimensions.width,
        height: 'auto',
        minHeight: deskDimensions.height,
        cursor: isDragging ? 'grabbing' : 'grab',
        touchAction: 'none',
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