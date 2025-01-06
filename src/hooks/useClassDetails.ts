import { useState, useEffect } from 'react';
import { useClassStore } from '../store/useClassStore';
import { studentsService } from '../lib/supabase/services/students.service';
import { incidentsService } from '../lib/supabase/services/incidents.service';
import { Position } from '../types';
import { formatAttendanceMessage } from '../utils/formatMessages';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import { useTemporaryAttendance } from './useTemporaryAttendance';
import { useAuthStore } from '../store/useAuthStore';

export const useClassDetails = (classId: string) => {
  const { classes, fetchClasses } = useClassStore();
  const { user } = useAuthStore();
  const [showClassroom, setShowClassroom] = useState(false);
  const { temporaryAttendance, updateTemporaryAttendance, clearTemporaryAttendance, markAllPresent } = useTemporaryAttendance(classId);
  const classData = classes.find((c) => c.id === classId);

  // Fetch classes data when component mounts or classId changes
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses, classId]);

  const handleAttendanceChange = (studentId: string, status: 'P' | 'F') => {
    updateTemporaryAttendance(studentId, status);
  };

  const handleMarkAllPresent = () => {
    if (classData?.students) {
      markAllPresent(classData.students.map(s => s.id));
    }
  };

  const handleRemoveStudent = async (studentId: string) => {
    if (user?.role !== 'COORDINATOR') {
      console.error('Unauthorized: Only coordinators can remove students');
      return;
    }

    try {
      await studentsService.removeStudent(studentId);
      await fetchClasses(); // Recarrega os dados após remover o aluno
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const handleAddIncident = async (
    studentId: string,
    incident: { type: string; date: string; description: string }
  ) => {
    try {
      await incidentsService.addIncident({
        studentId,
        type: incident.type as any,
        date: incident.date,
        description: incident.description,
      });
      await fetchClasses(); // Recarrega os dados após adicionar a ocorrência
    } catch (error) {
      console.error('Error adding incident:', error);
    }
  };

  const handleSaveClassroom = async (positions: Record<string, Position>) => {
    try {
      const updates = Object.entries(positions).map(([studentId, position]) =>
        studentsService.updateStudentPosition(studentId, position)
      );
      await Promise.all(updates);
      await fetchClasses(); // Recarrega os dados após salvar as posições
      setShowClassroom(false);
    } catch (error) {
      console.error('Error saving classroom layout:', error);
    }
  };

  const handleSendAttendance = async () => {
    if (!classData) return;

    const absentStudents = classData.students.filter(
      (student) => temporaryAttendance[student.id] === 'F'
    );

    if (absentStudents.length === 0) {
      alert('Nenhuma falta registrada.');
      return;
    }

    const message = formatAttendanceMessage(
      classData.name,
      absentStudents,
      new Date()
    );

    sendWhatsAppMessage(classData.pedagogist_phone, message);
    clearTemporaryAttendance();
  };

  return {
    classData,
    showClassroom,
    attendance: temporaryAttendance,
    userRole: user?.role,
    setShowClassroom,
    handleAttendanceChange,
    handleMarkAllPresent,
    handleRemoveStudent,
    handleAddIncident,
    handleSaveClassroom,
    handleSendAttendance,
  };
};