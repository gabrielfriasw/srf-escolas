import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PanelsTopLeft, Send } from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { ClassroomLayout } from '../../components/ClassroomLayout';
import { AddStudentForm } from '../../components/student/AddStudentForm';
import { AttendanceList } from '../../components/attendance/AttendanceList';

export const ClassDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { classes, updateClass } = useClassStore();
  const { addRecord } = useAttendanceStore();
  const user = useAuthStore((state) => state.user);
  const classData = classes.find((c) => c.id === id);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'F' | null>>({});
  const [showClassroom, setShowClassroom] = useState(false);

  useEffect(() => {
    if (classData) {
      const initialAttendance: Record<string, 'P' | 'F' | null> = {};
      classData.students.forEach((student) => {
        initialAttendance[student.id] = null;
      });
      setAttendance(initialAttendance);
    }
  }, [classData]);

  if (!classData) {
    return <div>Turma não encontrada</div>;
  }

  const isTeacher = user?.role === 'COORDINATOR' || user?.role === 'TEACHER';
  const isOwner = classData.ownerId === user?.id;

  const handleAddStudent = (student: { name: string; number: number }) => {
    if (!isTeacher || !isOwner) return;
    updateClass(id!, {
      students: [...classData.students, { id: Math.random().toString(36).substr(2, 9), ...student }],
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!isTeacher || !isOwner) return;
    updateClass(id!, {
      students: classData.students.filter((student) => student.id !== studentId),
    });
  };

  const handleAttendanceChange = (studentId: string, status: 'P' | 'F') => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveClassroom = (positions: Record<string, { x: number; y: number }>) => {
    const updatedStudents = classData.students.map((student) => ({
      ...student,
      position: positions[student.id],
    }));
    updateClass(id!, { students: updatedStudents });
    setShowClassroom(false);
  };

  const handleSendAttendance = () => {
    const finalAttendance = { ...attendance };
    classData.students.forEach((student) => {
      if (!finalAttendance[student.id]) {
        finalAttendance[student.id] = 'P';
      }
    });

    const absentStudents = classData.students
      .filter((student) => finalAttendance[student.id] === 'F')
      .map((student) => student.id);

    addRecord({
      classId: id!,
      date: new Date().toISOString(),
      absentStudents,
    });

    const absentStudentsFormatted = classData.students
      .filter((student) => finalAttendance[student.id] === 'F')
      .map((student) => `${student.number}. ${student.name}`)
      .join('\n');

    const message = `*Registro de Presença - ${classData.name}*\n\n` +
      `📅 Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
      `👨‍🏫 Professor: ${user!.name}\n\n` +
      `❌ *Alunos Ausentes:*\n${absentStudentsFormatted || 'Nenhum aluno ausente'}\n\n` +
      `_Sistema de Registro de Faltas_`;

    const whatsappUrl = `https://wa.me/${classData.pedagogistPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {classData.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{classData.grade}</p>
        </div>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <button
            onClick={() => setShowClassroom(!showClassroom)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
          >
            <PanelsTopLeft className="h-5 w-5" />
            <span>Espelho de Classe</span>
          </button>
          <button
            onClick={handleSendAttendance}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
          >
            <Send className="h-5 w-5" />
            <span>Enviar Registro</span>
          </button>
          <button
            onClick={() => navigate(`/dashboard/turma/${id}/historico`)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm sm:text-base"
          >
            <span>Histórico</span>
          </button>
        </div>
      </div>

      {showClassroom ? (
        <ClassroomLayout
          students={classData.students}
          onClose={() => setShowClassroom(false)}
          onSave={handleSaveClassroom}
          attendance={attendance}
          onAttendanceChange={handleAttendanceChange}
        />
      ) : (
        <>
          {isTeacher && isOwner && (
            <AddStudentForm onAddStudent={handleAddStudent} />
          )}
          <AttendanceList
            students={classData.students}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
            onRemoveStudent={handleRemoveStudent}
            classId={classData.id}
            pedagogistPhone={classData.pedagogistPhone}
          />
        </>
      )}
    </div>
  );
};