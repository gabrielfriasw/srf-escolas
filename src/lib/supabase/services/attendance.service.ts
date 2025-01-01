import { supabase } from '../supabase';

export const attendanceService = {
  createAttendanceRecord: async (classId: string, date: string, studentStatuses: Array<{ studentId: string; status: 'P' | 'F' }>) => {
    const { data: record, error: recordError } = await supabase
      .from('attendance_records')
      .insert({ class_id: classId, date })
      .select()
      .single();
    
    if (recordError) throw recordError;

    const details = studentStatuses.map(status => ({
      record_id: record.id,
      student_id: status.studentId,
      status: status.status,
    }));

    const { error: detailsError } = await supabase
      .from('attendance_details')
      .insert(details);
    
    if (detailsError) throw detailsError;

    return record;
  },

  getAttendanceRecords: async (classId: string) => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select(`
        *,
        attendance_details (
          *,
          student:students (
            id,
            name
          )
        )
      `)
      .eq('class_id', classId);
    
    if (error) throw error;
    return data;
  },
};