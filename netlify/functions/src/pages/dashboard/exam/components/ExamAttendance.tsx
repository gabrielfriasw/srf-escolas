import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useExamStore } from '../../../../store/useExamStore';
import { examService } from '../../../../lib/supabase/services/exam.service';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';
import { Button } from '../../../../components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/Select';

interface ExamAttendanceProps {
  sessionId: string;
}

export const ExamAttendance: React.FC<ExamAttendanceProps> = ({ sessionId }) => {
  const { sessions } = useExamStore();
  const [date] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const session = sessions.find(s => s.id === sessionId);
  const allocations = session?.exam_allocations || [];

  useEffect(() => {
    const loadAttendance = async () => {
      try {
        setLoading(true);
        const data = await examService.getAttendance(sessionId, date);
        const attendanceMap: Record<string, 'present' | 'absent' | 'late'> = {};
        data.forEach(record => {
          attendanceMap[record.student_id] = record.status;
        });
        setAttendance(attendanceMap);
      } catch (error) {
        console.error('Error loading attendance:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAttendance();
  }, [sessionId, date]);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const records = Object.entries(attendance).map(([student_id, status]) => ({
        student_id,
        status
      }));
      await examService.takeAttendance(sessionId, date, records);
    } catch (error) {
      console.error('Error saving attendance:', error);
    } finally {
      setSaving(false);
    }
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
    <Card>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Chamada do dia {format(new Date(date), 'dd/MM/yyyy')}</h3>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Chamada'}
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Turma Original</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map(allocation => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.student?.name}</TableCell>
                <TableCell>{allocation.original_class?.name}</TableCell>
                <TableCell>
                  <Select
                    value={attendance[allocation.student_id] || 'present'}
                    onValueChange={(value: 'present' | 'absent' | 'late') => 
                      handleStatusChange(allocation.student_id, value)
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Presente</SelectItem>
                      <SelectItem value="absent">Ausente</SelectItem>
                      <SelectItem value="late">Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
