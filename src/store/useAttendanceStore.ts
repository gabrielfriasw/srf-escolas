import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceStats } from '../types';

interface AttendanceState {
  records: AttendanceRecord[];
  addRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
  getRecordsByClass: (classId: string) => AttendanceRecord[];
  getMonthlyStats: (classId: string, month: number, year: number) => AttendanceStats | null;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => {
        const newRecord = {
          ...record,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          records: [...state.records, newRecord],
        }));
      },
      getRecordsByClass: (classId) => {
        return get().records.filter((record) => record.classId === classId);
      },
      getMonthlyStats: (classId, month, year) => {
        const records = get().records.filter((record) => {
          const recordDate = new Date(record.date);
          return (
            record.classId === classId &&
            recordDate.getMonth() === month &&
            recordDate.getFullYear() === year
          );
        });

        if (records.length === 0) return null;

        const studentAbsences: Record<string, number> = {};
        records.forEach((record) => {
          record.absentStudents.forEach((studentId) => {
            studentAbsences[studentId] = (studentAbsences[studentId] || 0) + 1;
          });
        });

        return {
          month: new Date(year, month).toLocaleString('pt-BR', { month: 'long' }),
          year,
          totalAbsences: records.reduce((total, record) => total + record.absentStudents.length, 0),
          students: Object.entries(studentAbsences).map(([id, absences]) => ({
            id,
            name: '', // Nome será preenchido pelo componente
            absences,
          })),
        };
      },
    }),
    {
      name: 'attendance-storage',
    }
  )
);