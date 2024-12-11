import { useState } from 'react';
import { Student, Classroom } from '../../types';
import { Check, X, AlertCircle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { ConfirmationDialog } from './ConfirmationDialog';

interface RoomViewProps {
  classroom: Classroom;
  students: Student[];
  absentStudents: Set<string>;
  onAttendanceChange: (studentId: string) => void;
}

export function RoomView({
  classroom,
  students,
  absentStudents,
  onAttendanceChange,
}: RoomViewProps) {
  const { updateStudentPosition } = useStore();
  const [draggedStudent, setDraggedStudent] = useState<Student | null>(null);
  const [targetPosition, setTargetPosition] = useState<{ row: number; column: number } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [targetStudent, setTargetStudent] = useState<Student | null>(null);

  const grid = Array.from({ length: classroom.rows }, () =>
    Array.from({ length: classroom.columns }, () => null)
  );

  students.forEach((student) => {
    if (student.position) {
      const { row, column } = student.position;
      if (row < classroom.rows && column < classroom.columns) {
        grid[row][column] = student;
      }
    }
  });

  const handleDragStart = (student: Student) => {
    setDraggedStudent(student);
  };

  const handleDragOver = (e: React.DragEvent, row: number, column: number) => {
    e.preventDefault();
    setTargetPosition({ row, column });
  };

  const handleDrop = (row: number, column: number) => {
    if (!draggedStudent) return;

    const targetStudent = grid[row][column];
    if (targetStudent) {
      setTargetStudent(targetStudent);
      setShowConfirmation(true);
    } else {
      updateStudentPosition(classroom.id, draggedStudent.id, { row, column });
    }

    setDraggedStudent(null);
    setTargetPosition(null);
  };

  const handleConfirmSwap = () => {
    if (!draggedStudent || !targetStudent || !targetPosition) return;

    const draggedPosition = draggedStudent.position;
    
    // Atualiza a posição do aluno arrastado
    updateStudentPosition(classroom.id, draggedStudent.id, targetPosition);
    
    // Atualiza a posição do aluno alvo
    if (draggedPosition) {
      updateStudentPosition(classroom.id, targetStudent.id, draggedPosition);
    }

    setShowConfirmation(false);
    setTargetStudent(null);
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-center">
          <p className="text-gray-600 dark:text-gray-300">Mesa do Professor</p>
        </div>
        <div 
          className="grid gap-4" 
          style={{ gridTemplateColumns: `repeat(${classroom.columns}, minmax(0, 1fr))` }}
        >
          {grid.flat().map((student, index) => {
            const row = Math.floor(index / classroom.columns);
            const column = index % classroom.columns;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 ${
                  targetPosition?.row === row && targetPosition?.column === column
                    ? 'border-indigo-500 dark:border-indigo-400'
                    : student
                    ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                    : 'border-dashed border-gray-300 dark:border-gray-600'
                }`}
                onDragOver={(e) => handleDragOver(e, row, column)}
                onDrop={() => handleDrop(row, column)}
              >
                {student ? (
                  <div
                    draggable
                    onDragStart={() => handleDragStart(student)}
                    className="space-y-2 cursor-move"
                  >
                    <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                      {student.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Nº {student.rollNumber}
                    </p>
                    <div className="flex gap-1 justify-center">
                      <button
                        onClick={() => onAttendanceChange(student.id)}
                        className={`p-1 rounded-full transition-colors duration-200 ${
                          !absentStudents.has(student.id)
                            ? 'bg-green-100 text-green-600 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onAttendanceChange(student.id)}
                        className={`p-1 rounded-full transition-colors duration-200 ${
                          absentStudents.has(student.id)
                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-20 flex items-center justify-center text-gray-400 dark:text-gray-500">
                    Vazio
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirmSwap}
        title="Trocar Lugares"
        message={`Deseja trocar ${draggedStudent?.name} de lugar com ${targetStudent?.name}?`}
      />
    </>
  );
}