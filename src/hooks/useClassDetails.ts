import { sendWhatsAppMessage } from '../utils/whatsapp';

// ... rest of imports

export const useClassDetails = (classId: string) => {
  // ... other code

  const handleSendAttendance = async () => {
    if (!classData) return;

    const absentStudents = classData.students.filter(
      student => attendance[student.id] === 'F'
    );

    if (absentStudents.length === 0) {
      alert('Nenhuma falta registrada.');
      return;
    }

    // Save attendance record first
    try {
      await addRecord({
        classId,
        date: new Date().toISOString(),
        absentStudents: absentStudents.map(student => student.id)
      });

      // Format and send message
      const message = formatAttendanceMessage(
        classData.name,
        absentStudents,
        new Date()
      );

      // Send via WhatsApp
      sendWhatsAppMessage(classData.pedagogistPhone, message);

      // Reset attendance after successful save
      const resetAttendance: Record<string, 'P' | 'F' | null> = {};
      classData.students.forEach(student => {
        resetAttendance[student.id] = null;
      });
      setAttendance(resetAttendance);
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Erro ao salvar registro de faltas. Tente novamente.');
    }
  };

  // ... rest of code
};