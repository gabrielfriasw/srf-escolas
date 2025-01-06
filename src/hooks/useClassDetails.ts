import { useState, useEffect } from 'react';
import { useClassStore } from '../store/useClassStore';
import { studentsService } from '../lib/supabase/services/students.service';
import { incidentsService } from '../lib/supabase/services/incidents.service';
import { Position } from '../types';
import { sendAttendanceRecord } from '../utils/attendance';
import { useTemporaryAttendance } from './useTemporaryAttendance';
import { useAuthStore } from '../store/useAuthStore';

export const useClassDetails = (classId: string) => {
  const { classes, fetchClasses } = useClassStore();
  const { user } = useAuthStore();
  const [showClassroom, setShowClassroom] = useState(false);
  const { temporaryAttendance, updateTemporaryAttendance, clearTemporaryAttendance, markAllPresent } = useTemporaryAttendance(classId);
  const classData = classes.find((c) => c.id === classId);

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

  const handleSendAttendance = async () => {
    if (!classData) return;
    
    await sendAttendanceRecord(
      classData,
      temporaryAttendance,
      clearTemporaryAttendance
    );
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