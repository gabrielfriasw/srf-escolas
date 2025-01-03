import { supabase } from '../supabase';

export const attendanceService = {
  createAttendanceRecord: async (classId: string, date: string, studentStatuses: Array<{ studentId: string; status: 'P' | 'F' }>) => {
    // Start a transaction
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
    const { data: records, error: recordsError } = await supabase
      .from('attendance_records')
      .select(`
        *,
        attendance_details (
          student_id,
          status
        )
      `)
      .eq('class_id', classId);
    
    if (recordsError) throw recordsError;

    return records.map(record => ({
      id: record.id,
      classId: record.class_id,
      date: record.date,
      absentStudents: record.attendance_details
        .filter(detail => detail.status === 'F')
        .map(detail => detail.student_id)
    }));
  },
};