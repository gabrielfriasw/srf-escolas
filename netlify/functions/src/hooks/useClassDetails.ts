import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase/supabase';
import { useClassStore } from '../store/useClassStore';
import { useAuthStore } from '../store/useAuthStore';
import { whatsappConfig } from '../config/whatsapp';

export const useClassDetails = (classId: string) => {
  const { classes, fetchClasses } = useClassStore();
  const { user } = useAuthStore();
  const [classData, setClassData] = useState<any>(null);
  const [showClassroom, setShowClassroom] = useState(false);
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'F'>>({});
  const [userRole, setUserRole] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState('');

  useEffect(() => {
    const loadUserSettings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('whatsapp_number')
          .eq('id', user.id)
          .single();
        
        if (data?.whatsapp_number) {
          setWhatsappNumber(data.whatsapp_number);
        }
      }
    };
    loadUserSettings();
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    const classData = classes.find((c) => c.id === classId);
    setClassData(classData);
    setUserRole(user?.role);
  }, [classes, classId, user]);

  const handleAttendanceChange = async (studentId: string, status: 'P' | 'F') => {
    try {
      const date = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('attendance')
        .upsert({
          class_id: classId,
          student_id: studentId,
          date,
          status,
        }, {
          onConflict: 'class_id,student_id,date'
        });

      if (error) throw error;

      setAttendance(prev => ({
        ...prev,
        [studentId]: status
      }));
    } catch (error) {
      console.error('Error updating attendance:', error);
    }
  };

  const handleMarkAllPresent = () => {
    if (!classData?.students) return;

    const newAttendance = classData.students.reduce((acc, student) => ({ 
      ...acc, 
      [student.id]: 'P' 
    }), {});
    
    setAttendance(newAttendance);
  };

  const handleRemoveStudent = async (studentId: string) => {
    try {
      await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
      
      await fetchClasses();
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  const handleAddIncident = async (studentId: string, incident: string) => {
    // Implementar adição de incidente
  };

  const handleSaveClassroom = async (positions: any) => {
    // Implementar salvamento do layout
  };

  const saveWhatsappNumber = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ whatsapp_number: whatsappNumber })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error saving whatsapp number:', error);
    }
  };

  const handleSendAbsenceByWhatsapp = () => {
    if (!classData || !whatsappNumber) return;

    const absentStudents = classData.students.filter(
      (student: any) => attendance[student.id] === 'F'
    );

    if (absentStudents.length === 0) {
      console.error('Nenhum aluno faltante para enviar.');
      return;
    }

    const formattedDate = format(new Date(), 'dd/MM/yyyy');
    const studentsText = absentStudents
      .map((student: any) => 
        whatsappConfig.regularClass.studentTemplate
          .replace('{number}', student.number.toString())
          .replace('{name}', student.name)
      )
      .join(whatsappConfig.regularClass.studentSeparator);

    const message = whatsappConfig.regularClass.absenceMessageTemplate
      .replace('{date}', formattedDate)
      .replace('{className}', classData.name)
      .replace('{grade}', classData.grade)
      .replace('{students}', studentsText);

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
  };

  return {
    classData,
    showClassroom,
    attendance,
    userRole,
    whatsappNumber,
    setShowClassroom,
    handleAttendanceChange,
    handleMarkAllPresent,
    handleRemoveStudent,
    handleAddIncident,
    handleSaveClassroom,
    handleSendAbsenceByWhatsapp,
    saveWhatsappNumber,
    setWhatsappNumber,
  };
};