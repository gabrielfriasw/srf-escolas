import { formatAttendanceMessage } from './formatMessages';
import { sendWhatsAppMessage } from './whatsapp';
import { Class } from '../types';

export const sendAttendanceRecord = async (
  classData: Class,
  attendance: Record<string, 'P' | 'F' | null>,
  onComplete: () => void
) => {
  // Get all students with their attendance status
  const studentsWithStatus = classData.students.map(student => ({
    ...student,
    status: attendance[student.id] || 'P' // Default to present if not marked
  }));

  const absentStudents = studentsWithStatus.filter(
    student => student.status === 'F'
  );

  // Create and send message
  const message = formatAttendanceMessage(
    classData.name,
    absentStudents,
    new Date()
  );

  sendWhatsAppMessage(classData.pedagogist_phone, message);
  onComplete();
};