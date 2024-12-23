import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Send, FileText } from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { Student, Position } from '../../types';
import { ClassroomLayout } from '../../components/ClassroomLayout';
import { AddStudentForm } from '../../components/student/AddStudentForm';
import { AttendanceList } from '../../components/attendance/AttendanceList';
import { ClassStatistics } from '../../components/statistics/ClassStatistics';
import { AttendanceModificationModal } from '../../components/attendance/AttendanceModificationModal';

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, updateClass } = useClassStore();
  const { addRecord, addModification } = useAttendanceStore();
  const user = useAuthStore((state) => state.user);
  const classData = classes.find((c) => c.id === id);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'F' | null>>({});
  const [showLayout, setShowLayout] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [currentRecord, setCurrentRecord] = useState<string | null>(null);

  useEffect(() => {
    if (classData) {
      const initialAttendance: Record<string, 'P' | 'F' | null> = {};
      classData.students.forEach(student => {
        initialAttendance[student.id] = null;
      });
      setAttendance(initialAttendance);
    }
  }, [classData]);

  if (!classData || !user) {
    return <div>Turma não encontrada</div>;
  }

  const canManageClass = user.role === 'COORDINATOR' || user.role === 'TEACHER';
  const isOwner = classData.ownerId === user.id;

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'position'>) => {
    const student: Student = {
      id: Math.random().toString(36).substr(2, 9),
      ...studentData,
    };
    updateClass(id, {
      students: [...classData.students, student],
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!canManageClass || !isOwner) return;
    updateClass(id, {
      students: classData.students.filter((s) => s.id !== studentId),
    });
  };

  const handleAttendanceChange = (studentId: string, status: 'P' | 'F') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleSaveLayout = (positions: Record<string, Position>) => {
    const updatedStudents = classData.students.map(student => ({
      ...student,
      position: positions[student.id],
    }));

    updateClass(id, {
      students: updatedStudents,
    });

    setShowLayout(false);
  };

  const handleSendAttendance = () => {
    const finalAttendance = { ...attendance };
    classData.students.forEach(student => {
      if (!finalAttendance[student.id]) {
        finalAttendance[student.id] = 'P';
      }
    });

    const absentStudents = classData.students
      .filter((student) => finalAttendance[student.id] === 'F')
      .map((student) => student.id);

    const recordId = Math.random().toString(36).substr(2, 9);
    
    addRecord({
      classId: id,
      date: new Date().toISOString(),
      absentStudents,
    });

    setCurrentRecord(recordId);

    const absentStudentsText = classData.students
      .filter((student) => finalAttendance[student.id] === 'F')
      .map((student) => `(${student.number}) ${student.name}`)
      .join(', ');

    const message = `Registro de Presença - ${
      classData.name
    } em ${new Date().toLocaleDateString()}:\nAlunos Ausentes: ${
      absentStudentsText || 'Nenhum'
    }`;

    setTimeout(() => {
      const whatsappUrl = `https://wa.me/${
        classData.pedagogistPhone
      }?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }, 0);
  };

  const handleModification = (type: 'ARRIVAL' | 'OBSERVATION', details: string) => {
    if (!currentRecord || !selectedStudent || !user) return;

    addModification(currentRecord, {
      timestamp: new Date().toISOString(),
      userId: user.id,
      userName: user.name,
      type,
      studentId: selectedStudent.id,
      details,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {classData.name}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {classData.grade}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 w-full sm:w-auto">
          <button
            onClick={() => setShowLayout(!showLayout)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm sm:text-base"
          >
            <Layout className="h-5 w-5" />
            <span>Espelho de Classe</span>
          </button>
          <button
            onClick={handleSendAttendance}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
          >
            <Send className="h-5 w-5" />
            <span>Enviar Registro</span>
          </button>
          <button
            onClick={() => setShowStats(!showStats)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm sm:text-base"
          >
            <FileText className="h-5 w-5" />
            <span>Estatísticas</span>
          </button>
        </div>
      </div>

      {showStats ? (
        <ClassStatistics classData={classData} />
      ) : showLayout ? (
        <ClassroomLayout
          students={classData.students}
          onClose={() => setShowLayout(false)}
          onSave={handleSaveLayout}
          attendance={attendance}
          onAttendanceChange={handleAttendanceChange}
        />
      ) : (
        <>
          {canManageClass && isOwner && (
            <AddStudentForm onAddStudent={handleAddStudent} />
          )}
          <AttendanceList
            students={classData.students}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
            onRemoveStudent={handleRemoveStudent}
            onModify={setSelectedStudent}
          />
        </>
      )}

      {selectedStudent && currentRecord && (
        <AttendanceModificationModal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onConfirm={handleModification}
          student={selectedStudent}
          initialCallTime={new Date().toLocaleTimeString()}
          teacherName={user.name}
        />
      )}
    </div>
  );
};