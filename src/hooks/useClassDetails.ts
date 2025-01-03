import { useState, useEffect } from 'react';
import { useClassStore } from '../store/useClassStore';
import { studentsService } from '../lib/supabase/services/students.service';
import { incidentsService } from '../lib/supabase/services/incidents.service';
import { Position } from '../types';
import { formatAttendanceMessage } from '../utils/formatMessages';
import { sendWhatsAppMessage } from '../utils/whatsapp';
import { useTemporaryAttendance } from './useTemporaryAttendance';

export const useClassDetails = (classId: string) => {
  const { classes, fetchClasses } = useClassStore();
  const [showClassroom, setShowClassroom] = useState(false);
  const { temporaryAttendance, updateTemporaryAttendance, clearTemporaryAttendance } = useTemporaryAttendance(classId);
  const classData = classes.find((c) => c.id === classId);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleAttendanceChange = (studentId: string, status: 'P' | 'F') => {
    updateTemporaryAttendance(studentId, status);
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      await studentsService.removeStudent(studentId);
      await fetchClasses();
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
      await fetchClasses();
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
      await fetchClasses();
      setShowClassroom(false);
    } catch (error) {
      console.error('Error saving classroom layout:', error);
    }
  };

  const handleSendAttendance = () => {
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

    // Clear temporary attendance after sending
    clearTemporaryAttendance();
  };

  return {
    classData,
    showClassroom,
    attendance: temporaryAttendance,
    setShowClassroom,
    handleAttendanceChange,
    handleRemoveStudent,
    handleAddIncident,
    handleSaveClassroom,
    handleSendAttendance,
  };
};