import { create } from 'zustand';
import { AttendanceRecord, AttendanceStats } from '../types';
import { supabase, subscribeToAttendance } from '../lib/supabase/supabase';

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  fetchRecords: (classId: string) => Promise<void>;
  addRecord: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  getRecordsByClass: (classId: string) => Promise<AttendanceRecord[]>;
  getMonthlyStats: (classId: string, month: number, year: number) => Promise<AttendanceStats | null>;
}

export const useAttendanceStore = create<AttendanceState>((set, get) => {
  // Set up real-time subscription
  subscribeToAttendance(() => {
    const state = get();
    if (state.records.length > 0) {
      state.fetchRecords(state.records[0].classId);
    }
  });

  return {
    records: [],
    loading: false,
    error: null,

    fetchRecords: async (classId: string) => {
      set({ loading: true, error: null });
      try {
        const { data: records, error } = await supabase
          .from('attendance_records')
          .select(`
            *,
            absent_students (
              student_id
            )
          `)
          .eq('class_id', classId);

        if (error) throw error;
        set({ records: records || [], loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },

    addRecord: async (record) => {
      try {
        // First create the attendance record
        const { data: newRecord, error: recordError } = await supabase
          .from('attendance_records')
          .insert([{
            class_id: record.classId,
            date: record.date,
          }])
          .select()
          .single();

        if (recordError) throw recordError;

        // Then create the absent students records
        if (record.absentStudents.length > 0) {
          const absentStudentsData = record.absentStudents.map(studentId => ({
            record_id: newRecord.id,
            student_id: studentId,
          }));

          const { error: absentError } = await supabase
            .from('absent_students')
            .insert(absentStudentsData);

          if (absentError) throw absentError;
        }

        await get().fetchRecords(record.classId);
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    getRecordsByClass: async (classId: string) => {
      const { data: records, error } = await supabase
        .from('attendance_records')
        .select(`
          *,
          absent_students (
            student_id
          )
        `)
        .eq('class_id', classId);

      if (error) throw error;
      return records || [];
    },

    getMonthlyStats: async (classId: string, month: number, year: number) => {
      try {
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);

        const { data: records, error } = await supabase
          .from('attendance_records')
          .select(`
            *,
            absent_students (
              student_id
            )
          `)
          .eq('class_id', classId)
          .gte('date', startDate.toISOString())
          .lt('date', endDate.toISOString());

        if (error) throw error;
        if (!records || records.length === 0) return null;

        const studentAbsences: Record<string, number> = {};
        records.forEach((record) => {
          record.absent_students.forEach((absent) => {
            studentAbsences[absent.student_id] = (studentAbsences[absent.student_id] || 0) + 1;
          });
        });

        return {
          month: startDate.toLocaleString('pt-BR', { month: 'long' }),
          year,
          totalAbsences: Object.values(studentAbsences).reduce((a, b) => a + b, 0),
          students: Object.entries(studentAbsences).map(([id, absences]) => ({
            id,
            name: '', // Name will be filled by the component
            absences,
          })),
        };
      } catch (error: any) {
        set({ error: error.message });
        return null;
      }
    },
  };
});