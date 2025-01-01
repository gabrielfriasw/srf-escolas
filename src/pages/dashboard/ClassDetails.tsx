import { formatWhatsAppMessage } from '../../utils/formatWhatsAppMessage';

// ... rest of the imports remain the same

const handleSaveAttendance = async () => {
  if (!classData) return;

  try {
    const absentStudents = Object.entries(attendance)
      .filter(([_, status]) => status === 'F')
      .map(([studentId]) => {
        const student = classData.students.find(s => s.id === studentId);
        if (!student) throw new Error('Student not found');
        return student;
      });

    await addRecord({
      classId: id!,
      date: new Date().toISOString(),
      absentStudents: absentStudents.map(s => s.id),
    });

    // Reset attendance
    const initialAttendance: Record<string, 'P' | 'F' | null> = {};
    classData.students.forEach(student => {
      initialAttendance[student.id] = null;
    });
    setAttendance(initialAttendance);

    // Send WhatsApp message
    const message = formatWhatsAppMessage(
      classData.name,
      absentStudents,
      new Date()
    );
    window.open(
      `https://wa.me/${classData.pedagogist_phone}?text=${message}`,
      '_blank'
    );
  } catch (error) {
    console.error('Error saving attendance:', error);
  }
export classDetails
};

