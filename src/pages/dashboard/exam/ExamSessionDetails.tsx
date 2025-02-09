import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/Dialog';
import { AttendanceList } from '../../../components/AttendanceList';
import { ClassroomLayout, ClassroomLayoutRef } from '../../../components/ClassroomLayout';
import { useExamStore } from '../../../store/useExamStore';
import { examService } from '../../../lib/supabase/services/exam.service';
import { format } from 'date-fns';
import { Student } from '../../../types/student';
import { supabase } from '../../../lib/supabase/supabase';
import { useExportLayout } from '../../../hooks/useExportLayout';
import { whatsappConfig } from '../../../config/whatsapp';

interface StudentEdit {
  id: string;
  temp_name: string;
  temp_number: number;
}

export const ExamSessionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [showClassroom, setShowClassroom] = useState(false);
  const [currentDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<any>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'present' | 'absent' | 'late'>>({});
  const [editingStudent, setEditingStudent] = useState<StudentEdit | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const layoutRef = useRef<ClassroomLayoutRef>(null);
  const { exportAsImage } = useExportLayout();

  // Carregar configurações do usuário
  useEffect(() => {
    const loadUserSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('whatsapp_number')
          .eq('id', user.id)
          .single();
        
        if (data?.whatsapp_number) {
          setWhatsappNumber(data.whatsapp_number);
        }
      }
    };
    loadUserSettings();
  }, []);

  // Salvar número do WhatsApp
  const saveWhatsappNumber = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ whatsapp_number: whatsappNumber })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error saving whatsapp number:', error);
    }
  };

  // Carregar dados do ensalamento
  useEffect(() => {
    const loadSessionData = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await examService.getSessionDetails(id);
        
        if (!data) {
          setError('Ensalamento não encontrado');
          return;
        }

        setSessionData(data);
        
        // Extrair alunos das alocações
        if (data?.exam_allocations) {
          const allocatedStudents = data.exam_allocations.map((allocation: any) => ({
            id: allocation.student.id,
            name: allocation.temp_name || allocation.student.name,
            number: allocation.temp_number || allocation.student.number,
            classId: allocation.original_class.id,
            className: allocation.original_class.name
          }));
          setStudents(allocatedStudents);
        }

        // Carregar registro de presença do dia
        const attendanceData = await examService.getAttendance(id, currentDate);
        const attendanceMap: Record<string, 'present' | 'absent' | 'late'> = {};
        attendanceData.forEach((record: any) => {
          attendanceMap[record.student_id] = record.status;
        });
        setAttendance(attendanceMap);

      } catch (error) {
        console.error('Error loading session data:', error);
        setError('Erro ao carregar dados do ensalamento');
      } finally {
        setLoading(false);
      }
    };

    loadSessionData();
  }, [id, currentDate]);

  const handleAttendanceChange = async (studentId: string, status: 'present' | 'absent' | 'late') => {
    if (!id) return;

    try {
      // Atualizar estado local primeiro
      setAttendance(prev => ({ ...prev, [studentId]: status }));

      // Enviar para o servidor
      await examService.takeAttendance(id, currentDate, [{
        student_id: studentId,
        status
      }]);
    } catch (error) {
      console.error('Error updating attendance:', error);
      // Reverter mudança em caso de erro
      setAttendance(prev => {
        const newState = { ...prev };
        delete newState[studentId];
        return newState;
      });
      // Mostrar erro para o usuário
      setError(error instanceof Error ? error.message : 'Erro ao registrar presença. Por favor, tente novamente.');
    }
  };

  const handleMarkAllPresent = async () => {
    if (!id) return;

    try {
      // Atualizar estado local primeiro
      const allPresent = students.reduce((acc, student) => {
        acc[student.id] = 'present';
        return acc;
      }, {} as Record<string, 'present' | 'absent' | 'late'>);
      
      setAttendance(allPresent);

      // Enviar para o servidor
      await examService.takeAttendance(
        id,
        currentDate,
        students.map(student => ({
          student_id: student.id,
          status: 'present'
        }))
      );
    } catch (error) {
      console.error('Error marking all present:', error);
      // Reverter em caso de erro
      setAttendance({});
      // Mostrar erro para o usuário
      setError(error instanceof Error ? error.message : 'Erro ao marcar todos presentes. Por favor, tente novamente.');
    }
  };

  const handleSaveAttendance = async () => {
    if (!id) return;

    try {
      // Enviar para o servidor
      await examService.saveAttendance(id, currentDate, Object.keys(attendance).map(studentId => ({
        student_id: studentId,
        status: attendance[studentId]
      })));
    } catch (error) {
      console.error('Error saving attendance:', error);
      setError(error instanceof Error ? error.message : 'Erro ao salvar presença. Por favor, tente novamente.');
    }
  };

  const handleSaveClassroom = async (positions: Array<{ student_id: string; position_x: number; position_y: number }>) => {
    try {
      await examService.updateSeating(id!, positions);
    } catch (error) {
      console.error('Error saving classroom layout:', error);
    }
  };

  const handleEditStudent = async () => {
    if (!editingStudent) return;

    try {
      await examService.updateStudentAllocation(id!, editingStudent.id, {
        temp_name: editingStudent.temp_name,
        temp_number: editingStudent.temp_number
      });

      // Atualizar lista local
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id
          ? { ...student, name: editingStudent.temp_name, number: editingStudent.temp_number }
          : student
      ));

      setEditingStudent(null);
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  const handleDownloadMirror = async () => {
    if (!sessionData) return;

    try {
      const layoutElement = layoutRef.current?.getLayoutElement();
      if (!layoutElement) {
        setError('Erro ao exportar imagem. Por favor, tente novamente.');
        return;
      }

      const imageData = await exportAsImage(layoutElement);
      const formattedDate = format(new Date(currentDate), 'dd/MM/yyyy');
      
      // Criar link para download
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `espelho-${sessionData.name}-${formattedDate}.jpg`;
      link.click();
    } catch (error) {
      console.error('Error downloading mirror:', error);
      setError('Erro ao fazer download do espelho. Por favor, tente novamente.');
    }
  };

  const handleSendAbsenceList = () => {
    if (!sessionData || !whatsappNumber) return;

    const absentStudents = students.filter(
      (student) => attendance[student.id] === 'absent'
    );

    if (absentStudents.length === 0) {
      setError('Nenhum aluno faltante para enviar.');
      return;
    }

    const formattedDate = format(new Date(currentDate), 'dd/MM/yyyy');
    const studentsText = absentStudents
      .map(student => 
        whatsappConfig.examSession.studentTemplate
          .replace('{number}', student.number.toString())
          .replace('{name}', student.name)
          .replace('{className}', student.className)
      )
      .join(whatsappConfig.examSession.studentSeparator);

    const message = whatsappConfig.examSession.absenceMessageTemplate
      .replace('{date}', formattedDate)
      .replace('{className}', students[0].className)
      .replace('{grade}', students[0].class_grade)
      .replace('{location}', sessionData.name)
      .replace('{students}', studentsText);

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!sessionData) {
    return <div>Ensalamento não encontrado</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Ensalamento</CardTitle>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">
                  {sessionData?.name} - {format(new Date(currentDate), 'dd/MM/yyyy')}
                </h3>
              </div>
              {!showClassroom && (
                <div className="flex gap-2">
                  <Button onClick={() => handleSaveAttendance()}>
                    Salvar Presença
                  </Button>
                  <Button onClick={handleMarkAllPresent}>
                    Marcar Todos Presentes
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Configuração do WhatsApp */}
          <div className="mb-4 flex items-center gap-2">
            <Input
              type="tel"
              placeholder="Número do WhatsApp (ex: 5511999999999)"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
            <Button onClick={saveWhatsappNumber}>Salvar Número</Button>
          </div>

          <div className="mb-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => setShowClassroom(!showClassroom)}
            >
              {showClassroom ? 'Ver Lista de Chamada' : 'Ver Espelho de Classe'}
            </Button>
          </div>

          {showClassroom ? (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={handleDownloadMirror} variant="outline">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Baixar Espelho
                </Button>
              </div>
              <ClassroomLayout
                ref={layoutRef}
                students={students}
                onClose={() => setShowClassroom(false)}
                attendance={attendance}
                onAttendanceChange={(studentId, status) => handleAttendanceChange(studentId, status)}
                onSave={handleSaveClassroom}
              />
            </>
          ) : (
            <>
              <div className="flex justify-end gap-2 mb-4">
                <Button onClick={handleMarkAllPresent}>
                  Marcar Todos Presentes
                </Button>
                <Button onClick={handleSendAbsenceList} disabled={!whatsappNumber}>
                  Enviar Faltas (WhatsApp)
                </Button>
              </div>
              <AttendanceList
                students={students}
                attendance={attendance}
                onAttendanceChange={handleAttendanceChange}
                showClass
                onEditStudent={(student) => setEditingStudent({
                  id: student.id,
                  temp_name: student.name,
                  temp_number: student.number
                })}
              />

              {/* Modal de Edição */}
              <Dialog open={!!editingStudent} onOpenChange={() => setEditingStudent(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Aluno</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Nome do Aluno"
                      value={editingStudent?.temp_name || ''}
                      onChange={(e) => setEditingStudent(prev => prev ? {
                        ...prev,
                        temp_name: e.target.value
                      } : null)}
                    />
                    <Input
                      type="number"
                      placeholder="Número de Chamada"
                      value={editingStudent?.temp_number || ''}
                      onChange={(e) => setEditingStudent(prev => prev ? {
                        ...prev,
                        temp_number: parseInt(e.target.value)
                      } : null)}
                    />
                    <Button onClick={handleEditStudent}>Salvar</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
