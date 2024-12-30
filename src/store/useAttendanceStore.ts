import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceStats } from '../types';
import { attendanceService } from '../services/database/attendanceService';

interface AttendanceState {
  records: AttendanceRecord[];
  addRecord: (record: Omit<AttendanceRecord, 'id'>) => Promise<void>;
  getRecordsByClass: (classId: string) => Promise<AttendanceRecord[]>;
  getMonthlyStats: (
    classId: string,
    month: number,
    year: number,
    shift?: string
  ) => Promise<AttendanceStats | null>;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],

      addRecord: async (record) => {
        const newRecord = await attendanceService.addRecord(record);
        set((state) => ({
          records: [...state.records, newRecord]
        }));
      },

      getRecordsByClass: async (classId) => {
        const records = await attendanceService.getRecordsByClass(classId);
        set({ records });
        return records;
      },

      getMonthlyStats: async (classId, month, year, shift) => {
        const records = await attendanceService.getRecordsByClass(classId);
        // Implementar cálculo de estatísticas
        return null;
      }
    }),
    {
      name: 'attendance-storage',
    }
  )
);