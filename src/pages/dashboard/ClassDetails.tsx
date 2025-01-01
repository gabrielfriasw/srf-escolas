import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Users, Send } from 'lucide-react';
import { useClassStore } from '../../store/useClassStore';
import { AddStudentForm } from '../../components/student/AddStudentForm';
import { AttendanceList } from '../../components/attendance/AttendanceList';
import { ClassroomLayout } from '../../components/ClassroomLayout';
import { studentsService } from '../../lib/supabase/services/students.service';
import { incidentsService } from '../../lib/supabase/services/incidents.service';
import { Position } from '../../types';
import { formatWhatsAppMessage } from '../../utils/formatWhatsAppMessage';

export const ClassDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { classes } = useClassStore();
  const classData = classes.find((c) => c.id === id);
  
  const [showClassroom, setShowClassroom] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'F' | null>>({});

  useEffect(() => {
    if (classData) {
      const initialAttendance: Record<string, 'P' | 'F' | null> = {};
      classData.students.forEach(student => {
        initialAttendance[student.id] = null;
      });
      setAttendance(initialAttendance);
    }
  }, [classData]);

  const handleSendAttendance = () => {
    if (!classData) return;

    const absentStudents = classData.students.filter(
      student => attendance[student.id] === 'F'
    );

    if (absentStudents.length === 0) {
      alert('Nenhuma falta registrada.');
      return;
    }

    const message = formatWhatsAppMessage(
      classData.name,
      absentStudents,
      new Date()
    );

    window.open(
      `https://wa.me/${classData.pedagogist_phone}?text=${message}`,
      '_blank'
    );

    // Reset attendance after sending
    const resetAttendance: Record<string, 'P' | 'F' | null> = {};
    classData.students.forEach(student => {
      resetAttendance[student.id] = null;
    });
    setAttendance(resetAttendance);
  };

  // ... rest of the existing code ...

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {classData.name}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{classData.grade}</p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleSendAttendance}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Send className="h-5 w-5" />
            <span>Enviar Registro</span>
          </button>

          <button
            onClick={() => setShowClassroom(!showClassroom)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <Users className="h-5 w-5" />
            <span>Espelho de Classe</span>
          </button>

          <button
            onClick={() => navigate(`/dashboard/turma/${id}/historico`)}
            className="flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900"
          >
            <FileText className="h-5 w-5" />
            <span>Histórico</span>
          </button>
        </div>
      </div>

      {/* ... rest of the existing JSX ... */}
    </div>
  );
};