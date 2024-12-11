import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { AttendanceList } from './attendance/AttendanceList';
import { RoomView } from './attendance/RoomView';
import { StudentForm } from './attendance/StudentForm';
import { ViewToggle } from './attendance/ViewToggle';
import { Student } from '../types';

export function AttendancePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, classrooms, addStudent } = useStore();
  const classroom = classrooms.find((c) => c.id === id);
  const [absentStudents, setAbsentStudents] = useState<Set<string>>(new Set());
  const [view, setView] = useState<'list' | 'room'>('list');

  if (!classroom) {
    return <div>Turma não encontrada</div>;
  }

  const handleAttendance = (studentId: string) => {
    const newAbsentStudents = new Set(absentStudents);
    if (newAbsentStudents.has(studentId)) {
      newAbsentStudents.delete(studentId);
    } else {
      newAbsentStudents.add(studentId);
    }
    setAbsentStudents(newAbsentStudents);
  };

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    addStudent(classroom.id, {
      id: Date.now().toString(),
      ...studentData,
    });
  };

  const handleSubmitAttendance = () => {
    const absent = classroom.students.filter((s) => absentStudents.has(s.id));
    const currentDate = format(new Date(), 'dd/MM/yyyy');
    
    const message = `Olá professor(a), estes alunos faltaram na turma ${classroom.name} hoje ${currentDate}:\n\n${absent
      .map((s) => `- ${s.name} (Nº: ${s.rollNumber})`)
      .join('\n')}`;
    
    const phoneNumber = classroom.pedagoguePhone.replace(/\D/g, '');
    
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar ao Painel
          </button>
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
            {classroom.name} - Chamada
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Chamada do dia: {format(new Date(), 'dd/MM/yyyy')}
          </p>
        </div>

        {user?.role === 'coordinator' && (
          <StudentForm
            onAddStudent={handleAddStudent}
            maxRows={classroom.rows}
            maxColumns={classroom.columns}
          />
        )}

        {view === 'list' ? (
          <AttendanceList
            students={classroom.students}
            absentStudents={absentStudents}
            onAttendanceChange={handleAttendance}
          />
        ) : (
          <RoomView
            classroom={classroom}
            students={classroom.students}
            absentStudents={absentStudents}
            onAttendanceChange={handleAttendance}
          />
        )}

        {classroom.students.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmitAttendance}
              className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 font-medium"
            >
              Enviar Chamada
            </button>
          </div>
        )}
      </div>
    </div>
  );
}