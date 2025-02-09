import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClassStore } from '../../../store/useClassStore';
import { useExamStore } from '../../../store/useExamStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/Select';
import { supabase } from '../../../lib/supabase/supabase';
import { examService } from '../../../lib/supabase/services/exam.service';

type ShiftType = 'all' | 'morning' | 'afternoon' | 'night';

export const NewExamSession: React.FC = () => {
  const navigate = useNavigate();
  const { classes, fetchClasses } = useClassStore();
  const { createSession, fetchSessions } = useExamStore();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    selectedClasses: [] as string[]
  });
  const [shiftFilter, setShiftFilter] = useState<ShiftType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSelectAllClasses = () => {
    const filteredClasses = getFilteredClasses();
    setFormData(prev => ({
      ...prev,
      selectedClasses: filteredClasses.map(c => c.id)
    }));
  };

  const handleUnselectAllClasses = () => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: []
    }));
  };

  const handleToggleClass = (classId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedClasses: prev.selectedClasses.includes(classId)
        ? prev.selectedClasses.filter(id => id !== classId)
        : [...prev.selectedClasses, classId]
    }));
  };

  const getFilteredClasses = () => {
    return classes.filter(classItem => {
      const matchesShift = shiftFilter === 'all' || classItem.shift === shiftFilter;
      const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          classItem.grade.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesShift && matchesSearch;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Form data:', formData);

      const validationErrors = [];
      if (!formData.name.trim()) validationErrors.push('nome do ensalamento');
      if (!formData.date) validationErrors.push('data');
      if (formData.selectedClasses.length === 0) validationErrors.push('turmas');

      if (validationErrors.length > 0) {
        throw new Error(`Por favor, preencha os seguintes campos: ${validationErrors.join(', ')}`);
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        throw new Error('Erro ao obter informações do usuário. Por favor, faça login novamente.');
      }

      // Ensure user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
        throw new Error('Erro ao verificar perfil do usuário');
      }

      if (!profile) {
        // Create profile if it doesn't exist
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email || '',
            name: user.email?.split('@')[0] || 'Usuário',
            role: 'teacher'
          });

        if (createProfileError) {
          console.error('Error creating profile:', createProfileError);
          throw new Error('Erro ao criar perfil do usuário');
        }
      }

      // Test database connection
      const { error: testError } = await supabase
        .from('exam_sessions')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('Database connection test error:', testError);
        throw new Error(`Erro ao conectar com o banco de dados: ${testError.message}`);
      }

      // 1. Create exam session
      const sessionData = {
        name: formData.name.trim(),
        date: formData.date,
        status: 'pending' as const,
        owner_id: user.id
      };

      console.log('Creating session with data:', sessionData);
      
      try {
        const session = await createSession(sessionData);
        console.log('Created session:', session);

        if (!session || !session.id) {
          throw new Error('Sessão criada mas nenhum ID retornado');
        }

        // 2. Get selected classes with their students
        const selectedClasses = classes.filter(c => formData.selectedClasses.includes(c.id));
        console.log('Selected classes:', selectedClasses);

        if (!selectedClasses.length) {
          throw new Error('Nenhuma turma selecionada');
        }

        // Check if selected classes have students
        const classesWithoutStudents = selectedClasses.filter(c => !c.students || c.students.length === 0);
        if (classesWithoutStudents.length > 0) {
          const classNames = classesWithoutStudents.map(c => c.name).join(', ');
          throw new Error(`As seguintes turmas não têm alunos: ${classNames}`);
        }

        // 3. Distribute students
        console.log('Distributing students for session:', session.id);
        
        try {
          const allocations = await examService.distributeStudents(
            session.id,
            selectedClasses
          );

          console.log('Created allocations:', allocations);

          if (!allocations || allocations.length === 0) {
            // Se não conseguiu alocar alunos, excluir a sessão
            await examService.deleteSession(session.id);
            throw new Error('Não foi possível alocar alunos para o ensalamento. Verifique se as turmas selecionadas têm alunos disponíveis.');
          }

          // Fetch sessions after successful creation
          await fetchSessions();

          // Success! Redirect to the session page
          navigate(`/dashboard/ensalamento/${session.id}`);
        } catch (error) {
          console.error('Error in student distribution:', error);
          // Se falhou na distribuição, excluir a sessão
          await examService.deleteSession(session.id);
          throw error;
        }
      } catch (error) {
        console.error('Error in session creation flow:', error);
        throw error;
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error instanceof Error ? error.message : 'Erro desconhecido ao criar ensalamento');
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = getFilteredClasses();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo Ensalamento</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome do Ensalamento
            </label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Prova Final - 2º Bimestre"
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Data
            </label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Turmas
            </label>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Buscar turmas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Select value={shiftFilter} onValueChange={(value: ShiftType) => setShiftFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Períodos</SelectItem>
                      <SelectItem value="morning">Manhã</SelectItem>
                      <SelectItem value="afternoon">Tarde</SelectItem>
                      <SelectItem value="night">Noite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleSelectAllClasses}
                  disabled={filteredClasses.length === 0 || filteredClasses.every(c => formData.selectedClasses.includes(c.id))}
                >
                  Selecionar Todas
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={handleUnselectAllClasses}
                  disabled={formData.selectedClasses.length === 0}
                >
                  Limpar Seleção
                </Button>
              </div>

              <div className="border rounded-lg p-4 max-h-60 overflow-y-auto space-y-2">
                {filteredClasses.length === 0 ? (
                  <p className="text-center text-gray-500">
                    {classes.length === 0
                      ? 'Nenhuma turma encontrada. Crie uma turma primeiro.'
                      : 'Nenhuma turma encontrada com os filtros selecionados.'}
                  </p>
                ) : (
                  filteredClasses.map((classItem) => (
                    <div key={classItem.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={classItem.id}
                        checked={formData.selectedClasses.includes(classItem.id)}
                        onCheckedChange={() => handleToggleClass(classItem.id)}
                      />
                      <label
                        htmlFor={classItem.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {classItem.name} - {classItem.grade} - {
                          classItem.shift === 'morning' ? 'Manhã' :
                          classItem.shift === 'afternoon' ? 'Tarde' : 'Noite'
                        }
                      </label>
                    </div>
                  ))
                )}
              </div>
              <p className="text-sm text-gray-500">
                {formData.selectedClasses.length} turma(s) selecionada(s)
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard/exam')}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Criando...' : 'Criar Ensalamento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};