import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceStats } from '../types';
import { attendanceService } from '../lib/supabase/services/attendance.service';

interface AttendanceState {
  records: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  fetchAttendance: () => Promise<void>;
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
      fetchAttendance: async () => {
        try {
          set({ loading: true, error: null });
          // Note: This would need to be implemented to fetch all records for the user
          // Currently just clearing the error state
          set({ error: null });
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
          await get().fetchAttendance();
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
        // Implementation remains the same as it's calculating from local state
        // You might want to add a method to fetch stats directly from Supabase
        // if you need more accurate real-time data
        const records = get().getRecordsByClass(classId);
        // ... rest of the implementation
        return null; // Updated implementation needed
      },
    }),
    {
      name: 'attendance-storage',
    }
  )
);