import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Send } from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { Student, Position } from '../../types';
import { ClassroomLayout } from '../../components/ClassroomLayout';
import { AddStudentForm } from '../../components/student/AddStudentForm';
import { AttendanceList } from '../../components/attendance/AttendanceList';
import { PeterAlert } from '../../components/easter-eggs/PeterAlert';
import { TeacherAssignment } from '../../components/teacher/TeacherAssignment';

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes, updateClass } = useClassStore();
  const { addRecord } = useAttendanceStore();
  const user = useAuthStore((state) => state.user);
  const classData = classes.find((c) => c.id === id);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'F' | null>>({});
  const [showLayout, setShowLayout] = useState(false);
  const [showPeterAlert, setShowPeterAlert] = useState(false);

  // Redirect if class not found
  useEffect(() => {
    if (!classData) {
      navigate('/dashboard');
    }
  }, [classData, navigate]);

  if (!classData || !id) {
    return <div className="p-4">Carregando...</div>;
  }

  const canManageClass = user?.role === 'DIRECTOR' || user?.role === 'COORDINATOR' || user?.role === 'TEACHER';
  const isOwnerOrDirector = classData.ownerId === user?.id || user?.role === 'DIRECTOR';
  const canAssignTeachers = user?.role === 'DIRECTOR';

  const handleAddStudent = (studentData: Omit<Student, 'id' | 'position'>) => {
    const student: Student = {
      id: Math.random().toString(36).substr(2, 9),
      ...studentData,
      incidents: []
    };
    updateClass(id, {
      students: [...classData.students, student],
    });
  };

  const handleRemoveStudent = (studentId: string) => {
    if (!canManageClass || !isOwnerOrDirector) return;
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

  const handleAddIncident = (studentId: string, incident: { type: string; date: string; description: string }) => {
    const updatedStudents = classData.students.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          incidents: [...(student.incidents || []), {
            id: Math.random().toString(36).substr(2, 9),
            studentId,
            type: incident.type as any,
            date: incident.date,
            description: incident.description
          }]
        };
      }
      return student;
    });

    updateClass(id, { students: updatedStudents });
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

  return (
    <div className="space-y-6">
      <PeterAlert isOpen={showPeterAlert} onClose={() => setShowPeterAlert(false)} />
      
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
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            <Layout className="h-5 w-5" />
            <span>Espelho de Classe</span>
          </button>
          <button
            onClick={() => navigate(`/dashboard/turma/${id}/historico`)}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm sm:text-base"
          >
            <span>Histórico</span>
          </button>
        </div>
      </div>

      {showLayout ? (
        <ClassroomLayout
          students={classData.students}
          onClose={() => setShowLayout(false)}
          onSave={handleSaveLayout}
          attendance={attendance}
          onAttendanceChange={handleAttendanceChange}
        />
      ) : (
        <>
          {canAssignTeachers && <TeacherAssignment classId={id} />}
          
          {(canManageClass && isOwnerOrDirector) && (
            <AddStudentForm onAddStudent={handleAddStudent} />
          )}
          
          <AttendanceList
            students={classData.students}
            attendance={attendance}
            onAttendanceChange={handleAttendanceChange}
            onRemoveStudent={handleRemoveStudent}
            onAddIncident={handleAddIncident}
            classData={classData}
          />
        </>
      )}
    </div>
  );
};