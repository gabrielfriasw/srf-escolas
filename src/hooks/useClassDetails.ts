import { useState, useEffect } from 'react';
import { useClassStore } from '../store/useClassStore';
import { studentsService } from '../lib/supabase/services/students.service';
import { incidentsService } from '../lib/supabase/services/incidents.service';
import { Position } from '../types';
import { formatWhatsAppMessage } from '../utils/formatWhatsAppMessage';

export const useClassDetails = (classId: string) => {
  const { classes, fetchClasses } = useClassStore();
  const classData = classes.find((c) => c.id === classId);
  const [showClassroom, setShowClassroom] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'F' | null>>({});

  useEffect(() => {
    if (!classData) {
      fetchClasses();
    }
    
    if (classData) {
      const initialAttendance: Record<string, 'P' | 'F' | null> = {};
      classData.students.forEach(student => {
        initialAttendance[student.id] = null;
      });
      setAttendance(initialAttendance);
    }
  }, [classData, fetchClasses]);

  const handleAttendanceChange = (studentId: string, status: 'P' | 'F') => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      await studentsService.removeStudent(studentId);
      await fetchClasses();
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const handleAddIncident = async (studentId: string, incident: { type: string; date: string; description: string }) => {
    try {
      await incidentsService.addIncident({
        studentId,
        ...incident,
      });
      await fetchClasses();
    } catch (error) {
      console.error('Error adding incident:', error);
    }
  };

  const handleSaveClassroom = async (positions: Record<string, Position>) => {
    try {
      await Promise.all(
        Object.entries(positions).map(([studentId, position]) =>
          studentsService.updateStudentPosition(studentId, position)
        )
      );
      await fetchClasses();
      setShowClassroom(false);
    } catch (error) {
      console.error('Error saving classroom layout:', error);
    }
  };

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
      `https://wa.me/${classData.pedagogist_phone}?text=${encodeURIComponent(message)}`,
      '_blank'
    );

    const resetAttendance: Record<string, 'P' | 'F' | null> = {};
    classData.students.forEach(student => {
      resetAttendance[student.id] = null;
    });
    setAttendance(resetAttendance);
  };

  return {
    classData,
    showClassroom,
    attendance,
    setShowClassroom,
    handleAttendanceChange,
    handleRemoveStudent,
    handleAddIncident,
    handleSaveClassroom,
    handleSendAttendance,
  };
};