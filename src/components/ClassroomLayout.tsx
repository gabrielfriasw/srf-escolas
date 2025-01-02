import React, { useState, useEffect, useRef } from 'react';
import { Student, Position } from '../types';
import { TeacherDesk } from './classroom/TeacherDesk';
import { StudentDesk } from './classroom/StudentDesk';
import { ClassroomHeader } from './classroom/ClassroomHeader';
import { useClassroomDimensions } from '../hooks/useClassroomDimensions';
import { DeleteConfirmationModal } from './modals/DeleteConfirmationModal';

interface ClassroomLayoutProps {
  students: Student[];
  onClose: () => void;
  onSave: (positions: Record<string, Position>) => void;
  attendance: Record<string, 'P' | 'F' | null>;
  onAttendanceChange: (studentId: string, status: 'P' | 'F') => void;
}

export const ClassroomLayout: React.FC<ClassroomLayoutProps> = ({
  students,
  onClose,
  onSave,
  attendance,
  onAttendanceChange,
}) => {
  const [positions, setPositions] = useState<Record<string, Position>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dimensions = useClassroomDimensions(containerRef);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window);
  }, []);

  useEffect(() => {
    const initialPositions: Record<string, Position> = {};
    students.forEach((student, index) => {
      if (student.position) {
        initialPositions[student.id] = student.position;
      } else {
        const row = Math.floor(index / dimensions.desksPerRow);
        const col = index % dimensions.desksPerRow;
        initialPositions[student.id] = {
          x: col * (dimensions.deskWidth + dimensions.deskSpacingX) + dimensions.deskSpacingX,
          y: row * (dimensions.deskHeight + dimensions.deskSpacingY) + 100,
        };
      }
    });
    setPositions(initialPositions);
  }, [students, dimensions]);

  const handleDragStart = (studentId: string, e: React.DragEvent | React.TouchEvent) => {
    setDraggingId(studentId);
    if (e.type === 'dragstart') {
      const dragEvent = e as React.DragEvent;
      const dragImage = new Image();
      dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      dragEvent.dataTransfer.setDragImage(dragImage, 0, 0);
    }
  };

  const handleMove = (e: React.DragEvent | React.TouchEvent, studentId: string) => {
    if (draggingId === studentId) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        let clientX, clientY;
        
        if ('touches' in e) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = (e as React.DragEvent).clientX;
          clientY = (e as React.DragEvent).clientY;
        }

        if (clientX === 0 && clientY === 0) return;

        const x = Math.max(0, Math.min(clientX - rect.left - dimensions.deskWidth / 2, rect.width - dimensions.deskWidth));
        const y = Math.max(0, Math.min(clientY - rect.top - dimensions.deskHeight / 2, rect.height - dimensions.deskHeight));
        
        setPositions({
          ...positions,
          [studentId]: { x, y },
        });
        setHasChanges(true);
      }
    }
  };

  const handleMoveEnd = () => {
    setDraggingId(null);
  };

  const handleSave = () => {
    setShowSaveConfirmation(true);
  };

  const confirmSave = () => {
    onSave(positions);
    setHasChanges(false);
    setShowSaveConfirmation(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
      <ClassroomHeader
        onSave={handleSave}
        onClose={() => {
          if (hasChanges) {
            setShowSaveConfirmation(true);
          } else {
            onClose();
          }
        }}
      />

      <div
        ref={containerRef}
        className="relative border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden touch-none"
        style={{ height: '70vh', minHeight: '400px' }}
      >
        <TeacherDesk />

        {students.map((student) => (
          <StudentDesk
            key={student.id}
            student={student}
            position={positions[student.id] || { x: 0, y: 0 }}
            attendance={attendance[student.id]}
            onAttendanceChange={(status) => onAttendanceChange(student.id, status)}
            onDragStart={(e) => handleDragStart(student.id, e)}
            onDrag={(e) => handleMove(e, student.id)}
            onTouchStart={(e) => handleDragStart(student.id, e)}
            onTouchMove={(e) => handleMove(e, student.id)}
            onDragEnd={handleMoveEnd}
            onTouchEnd={handleMoveEnd}
            isDragging={draggingId === student.id}
            isTouchDevice={isTouchDevice}
            deskDimensions={{
              width: dimensions.deskWidth,
              height: dimensions.deskHeight,
            }}
          />
        ))}
      </div>

      <DeleteConfirmationModal
        isOpen={showSaveConfirmation}
        onClose={() => setShowSaveConfirmation(false)}
        onConfirm={confirmSave}
        title="Salvar Alterações"
        message="Deseja salvar as alterações feitas no espelho de classe?"
      />
    </div>
  );
};