import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceStats } from '../types';
import { attendanceService } from '../lib/supabase/services/attendance.service';

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  fetchAttendance: (classId: string) => Promise<void>;
  addRecord: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  getRecordsByClass: (classId: string) => AttendanceRecord[];
  getMonthlyStats: (
    classId: string,
    month: number,
    year: number,
    shift?: string
  ) => AttendanceStats | null;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      loading: false,
      error: null,
      fetchAttendance: async (classId: string) => {
        try {
          set({ loading: true, error: null });
          const records = await attendanceService.getAttendanceRecords(classId);
          set({ records: records });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ loading: false });
        }
      },
      addRecord: async (record) => {
        try {
          set({ loading: true, error: null });
          const studentStatuses = record.absentStudents.map(studentId => ({
            studentId,
            status: 'F' as const
          }));
          
          await attendanceService.createAttendanceRecord(
            record.classId,
            record.date,
            studentStatuses
          );
          
          // Refresh the records after adding
          await get().fetchAttendance(record.classId);
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      getRecordsByClass: (classId) => {
        return get().records.filter((record) => record.classId === classId);
      },
      getMonthlyStats: (classId, month, year, shift) => {
        const records = get().getRecordsByClass(classId);
        
        if (records.length === 0) return null;

        const filteredRecords = records.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate.getMonth() === month && recordDate.getFullYear() === year;
        });

        if (filteredRecords.length === 0) return null;

        // Calculate statistics
        const totalAbsences = filteredRecords.reduce(
          (sum, record) => sum + record.absentStudents.length,
          0
        );

        const studentAbsences = new Map<string, number>();
        filteredRecords.forEach(record => {
          record.absentStudents.forEach(studentId => {
            studentAbsences.set(
              studentId,
              (studentAbsences.get(studentId) || 0) + 1
            );
          });
        });

        const students = Array.from(studentAbsences.entries()).map(([id, absences]) => ({
          id,
          absences,
          name: '' // This should be populated from the class data
        }));

        const totalDays = filteredRecords.length;
        const averageAttendance = 100 - (totalAbsences / (totalDays * students.length) * 100);

        return {
          month: new Date(year, month).toLocaleString('pt-BR', { month: 'long' }),
          year,
          totalAbsences,
          averageAttendance,
          students: students.sort((a, b) => a.absences - b.absences)
        };
      },
    }),
    {
      name: 'attendance-storage',
    }
  )
);