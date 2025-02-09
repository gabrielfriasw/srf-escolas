import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase/supabase';
import { format } from 'date-fns';

interface StudentStats {
  id: string;
  name: string;
  number: number;
  absences: number;
  absenceDates: string[];
}

interface ClassStats {
  totalClasses: number;
  students: StudentStats[];
}

export const useStats = (classId: string) => {
  const [stats, setStats] = useState<ClassStats>({ totalClasses: 0, students: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!classId) {
        setError('ID da turma não fornecido');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Buscar alunos da turma
        const { data: studentsData, error: studentsError } = await supabase
          .from('students')
          .select('id, name, number')
          .eq('class_id', classId)
          .order('number');

        if (studentsError) {
          console.error('Erro ao buscar alunos:', studentsError);
          throw new Error(`Erro ao buscar alunos: ${studentsError.message}`);
        }

        if (!studentsData) {
          throw new Error('Nenhum dado de aluno retornado');
        }

        // Inicializar estatísticas dos alunos
        const studentStats = studentsData.reduce<Record<string, StudentStats>>((acc, student) => {
          acc[student.id] = {
            id: student.id,
            name: student.name,
            number: student.number,
            absences: 0,
            absenceDates: [],
          };
          return acc;
        }, {});

        // Buscar registros de presença
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('student_id, date, status')
          .eq('class_id', classId);

        if (attendanceError) {
          console.error('Erro ao buscar presenças:', attendanceError);
          throw new Error(`Erro ao buscar presenças: ${attendanceError.message}`);
        }

        if (!attendanceData) {
          throw new Error('Nenhum dado de presença retornado');
        }

        // Processar registros de presença
        const uniqueDates = new Set<string>();
        
        // Primeiro, coletar todas as datas únicas
        attendanceData.forEach(record => {
          uniqueDates.add(format(new Date(record.date), 'yyyy-MM-dd'));
        });

        // Depois, processar faltas
        attendanceData.forEach(record => {
          if (record.status === 'F' && studentStats[record.student_id]) {
            studentStats[record.student_id].absences++;
            studentStats[record.student_id].absenceDates.push(
              format(new Date(record.date), 'dd/MM/yyyy')
            );
          }
        });

        // Ordenar alunos por número
        const sortedStudents = Object.values(studentStats).sort((a, b) => a.number - b.number);

        const finalStats = {
          totalClasses: uniqueDates.size,
          students: sortedStudents,
        };

        console.log('Estatísticas calculadas:', {
          totalClasses: finalStats.totalClasses,
          totalStudents: finalStats.students.length,
          students: finalStats.students.map(s => ({
            name: s.name,
            absences: s.absences,
          })),
        });

        setStats(finalStats);
      } catch (err) {
        console.error('Erro detalhado ao buscar estatísticas:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
        setError(`Erro ao buscar estatísticas: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [classId]);

  return {
    stats,
    loading,
    error,
  };
};