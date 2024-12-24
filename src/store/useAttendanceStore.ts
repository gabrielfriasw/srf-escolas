import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceStats } from '../types';

interface AttendanceState {
  records: AttendanceRecord[];
  addRecord: (record: Omit<AttendanceRecord, 'id'>) => void;
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
      getMonthlyStats: (classId, month, year, shift) => {
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

        const totalStudents = Object.keys(studentAbsences).length;
        const totalAbsences = records.reduce(
          (total, record) => total + record.absentStudents.length,
          0
        );
        const totalPossibleAttendances = totalStudents * records.length;
        const averageAttendance =
          ((totalPossibleAttendances - totalAbsences) / totalPossibleAttendances) * 100;

        return {
          month: new Date(year, month).toLocaleString('pt-BR', { month: 'long' }),
          year,
          totalAbsences: Math.floor(totalAbsences / 2), // Fixing the double-counting bug
          averageAttendance,
          students: Object.entries(studentAbsences)
            .map(([id, absences]) => ({
              id,
              name: '', // Will be filled by the component
              absences: Math.floor(absences / 2), // Fixing the double-counting bug
            }))
            .sort((a, b) => a.absences - b.absences),
        };
      },
    }),
    {
      name: 'attendance-storage',
    }
  )
);