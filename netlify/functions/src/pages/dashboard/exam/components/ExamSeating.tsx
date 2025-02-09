import React, { useEffect, useState } from 'react';
import { useExamStore } from '../../../../store/useExamStore';
import { examService } from '../../../../lib/supabase/services/exam.service';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Button } from '../../../../components/ui/Button';
import type { ExamSeating as ExamSeatingType } from '../../../../types/exam';

interface ExamSeatingProps {
  sessionId: string;
}

const GRID_SIZE = 6; // 6x6 grid = 36 seats

export const ExamSeating: React.FC<ExamSeatingProps> = ({ sessionId }) => {
  const { sessions } = useExamStore();
  const [seating, setSeating] = useState<ExamSeatingType[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  const session = sessions.find(s => s.id === sessionId);
  const allocations = session?.exam_allocations || [];

  useEffect(() => {
    const loadSeating = async () => {
      try {
        setLoading(true);
        const data = await examService.getSeating(sessionId);
        setSeating(data);
      } catch (error) {
        console.error('Error loading seating:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSeating();
  }, [sessionId]);

  const getStudentAtPosition = (x: number, y: number) => {
    const seat = seating.find(s => s.position_x === x && s.position_y === y);
    if (!seat) return null;
    return allocations.find(a => a.student_id === seat.student_id)?.student;
  };

  const handleSeatClick = async (x: number, y: number) => {
    if (selectedStudent) {
      // Remove student from previous position
      const newSeating = seating.filter(
        s => s.student_id !== selectedStudent
      );

      // Add student to new position
      newSeating.push({
        id: '', // Will be set by the server
        exam_session_id: sessionId,
        student_id: selectedStudent,
        position_x: x,
        position_y: y,
        owner_id: '', // Will be set by the server
        created_at: '', // Will be set by the server
        updated_at: '', // Will be set by the server
      });

      try {
        setSaving(true);
        await examService.updateSeating(sessionId, [{
          student_id: selectedStudent,
          position_x: x,
          position_y: y
        }]);
        setSeating(newSeating);
      } catch (error) {
        console.error('Error updating seating:', error);
      } finally {
        setSaving(false);
        setSelectedStudent(null);
      }
    }
  };

  const handleStudentSelect = (studentId: string) => {
    setSelectedStudent(studentId === selectedStudent ? null : studentId);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Espelho de Classe</h3>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const x = index % GRID_SIZE;
              const y = Math.floor(index / GRID_SIZE);
              const student = getStudentAtPosition(x, y);
              
              return (
                <Button
                  key={`${x}-${y}`}
                  variant={student ? "secondary" : "outline"}
                  className="h-16 p-1 text-xs"
                  onClick={() => handleSeatClick(x, y)}
                  disabled={saving}
                >
                  {student ? student.name : 'Vazio'}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-medium mb-4">Alunos Disponíveis</h3>
          <div className="grid grid-cols-2 gap-2">
            {allocations.map(allocation => {
              const isSeated = seating.some(s => s.student_id === allocation.student_id);
              const isSelected = selectedStudent === allocation.student_id;
              
              return (
                <Button
                  key={allocation.id}
                  variant={isSelected ? "secondary" : isSeated ? "outline" : "default"}
                  className="text-xs"
                  onClick={() => handleStudentSelect(allocation.student_id)}
                  disabled={saving}
                >
                  {allocation.student?.name}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
