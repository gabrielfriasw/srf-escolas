import React from 'react';
import { useExamStore } from '../../../../store/useExamStore';
import { Card, CardContent } from '../../../../components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../../components/ui/Table';

interface ExamStudentsProps {
  sessionId: string;
}

export const ExamStudents: React.FC<ExamStudentsProps> = ({ sessionId }) => {
  const { sessions } = useExamStore();
  const session = sessions.find(s => s.id === sessionId);
  const allocations = session?.exam_allocations || [];

  if (allocations.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            Nenhum aluno alocado neste ensalamento.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Matrícula</TableHead>
              <TableHead>Turma Original</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allocations.map(allocation => (
              <TableRow key={allocation.id}>
                <TableCell>{allocation.student?.name}</TableCell>
                <TableCell>{allocation.student?.number}</TableCell>
                <TableCell>{allocation.original_class?.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
