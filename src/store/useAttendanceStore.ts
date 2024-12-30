import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceStats } from '../types';
import { useClassStore } from './useClassStore';

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
        const classData = useClassStore.getState().classes.find(c => c.id === classId);
        if (!classData) return null;
        if (shift && classData.shift !== shift) return null;

        const records = get().records.filter((record) => {
          const recordDate = new Date(record.date);
          return (
            record.classId === classId &&
            recordDate.getMonth() === month &&
            recordDate.getFullYear() === year
          );
        });

        // Se não houver registros, retorne estatísticas zeradas
        const studentAbsences: Record<string, number> = {};
        classData.students.forEach(student => {
          studentAbsences[student.id] = 0;
        });

        if (records.length > 0) {
          records.forEach((record) => {
            record.absentStudents.forEach((studentId) => {
              if (studentId in studentAbsences) {
                studentAbsences[studentId]++;
              }
            });
          });
        }

        const totalAbsences = Object.values(studentAbsences).reduce((sum, count) => sum + count, 0);
        const totalStudents = classData.students.length;
        const totalDays = Math.max(records.length, 1); // Evita divisão por zero
        const totalPossibleAttendances = totalStudents * totalDays;
        const averageAttendance = totalPossibleAttendances > 0 
          ? ((totalPossibleAttendances - totalAbsences) / totalPossibleAttendances) * 100
          : 100;

        const studentStats = classData.students
          .map(student => ({
            id: student.id,
            name: student.name,
            absences: studentAbsences[student.id] || 0
          }))
          .sort((a, b) => a.absences - b.absences);

        return {
          month: new Date(year, month).toLocaleString('pt-BR', { month: 'long' }),
          year,
          totalAbsences,
          averageAttendance,
          students: studentStats
        };
      },
    }),
    {
      name: 'attendance-storage',
    }
  )
);