import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExamStore } from '../../../store/useExamStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Input } from '../../../components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed';

export const ExamDashboard: React.FC = () => {
  const { sessions, loading, error, fetchSessions, deleteSession } = useExamStore();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleDelete = async (sessionId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este ensalamento? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      setDeletingId(sessionId);
      await deleteSession(sessionId);
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Erro ao excluir ensalamento: ' + (error instanceof Error ? error.message : 'Erro desconhecido'));
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSessions = sessions
    .filter(session => {
      if (filterStatus !== 'all' && session.status !== filterStatus) return false;
      if (filterDate) {
        const sessionDate = startOfDay(new Date(session.date));
        const compareDate = startOfDay(new Date(filterDate));
        return sessionDate.getTime() === compareDate.getTime();
      }
      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });

  if (loading && sessions.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ensalamentos</h1>
          <Link to="/dashboard/ensalamento/novo">
            <Button>Novo Ensalamento</Button>
          </Link>
        </div>
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Ensalamentos</h1>
          <Link to="/dashboard/ensalamento/novo">
            <Button>Novo Ensalamento</Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-red-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ensalamentos</h1>
        <Link to="/dashboard/ensalamento/novo">
          <Button>Novo Ensalamento</Button>
        </Link>
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Data
              </label>
              <Input
                id="date-filter"
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filtrar por Status
              </label>
              <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredSessions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500">
              {sessions.length === 0
                ? 'Nenhum ensalamento encontrado. Crie um novo ensalamento para começar!'
                : 'Nenhum ensalamento encontrado com os filtros selecionados.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Link to={`/dashboard/ensalamento/${session.id}`} className="hover:text-blue-600">
                    <CardTitle>{session.name}</CardTitle>
                  </Link>
                  <Badge className={getStatusColor(session.status)}>
                    {session.status === 'pending' && 'Pendente'}
                    {session.status === 'in_progress' && 'Em Andamento'}
                    {session.status === 'completed' && 'Concluído'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500 mb-4">
                  Data: {format(new Date(session.date), 'dd/MM/yyyy')}
                </div>
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/dashboard/ensalamento/${session.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(session.id)}
                    disabled={deletingId === session.id}
                  >
                    {deletingId === session.id ? 'Excluindo...' : 'Excluir'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};