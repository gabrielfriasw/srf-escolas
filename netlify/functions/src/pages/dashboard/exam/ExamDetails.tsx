import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useExamStore } from '../../../store/useExamStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/Tabs';
import { format } from 'date-fns';
import { ExamAttendance } from './components/ExamAttendance';
import { ExamSeating } from './components/ExamSeating';
import { ExamStudents } from './components/ExamStudents';

export const ExamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { sessions, loading, error, fetchSessions } = useExamStore();
  const [activeTab, setActiveTab] = useState('students');

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  if (loading) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">Carregando...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Erro: {error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const session = sessions.find(s => s.id === id);
  if (!session) {
    return (
      <div className="p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">Ensalamento não encontrado</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{session.name}</CardTitle>
              <p className="text-sm text-gray-500">
                Data: {format(new Date(session.date), 'dd/MM/yyyy')}
              </p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs ${
              session.status === 'completed' ? 'bg-green-100 text-green-800' :
              session.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {session.status === 'completed' ? 'Concluído' :
               session.status === 'in_progress' ? 'Em Andamento' :
               'Pendente'}
            </span>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="attendance">Chamada</TabsTrigger>
          <TabsTrigger value="seating">Espelho de Classe</TabsTrigger>
        </TabsList>

        <TabsContent value="students">
          <ExamStudents sessionId={session.id} />
        </TabsContent>

        <TabsContent value="attendance">
          <ExamAttendance sessionId={session.id} />
        </TabsContent>

        <TabsContent value="seating">
          <ExamSeating sessionId={session.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
