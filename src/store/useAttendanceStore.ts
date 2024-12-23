import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AttendanceRecord, AttendanceStats, AttendanceModification } from '../types';

interface AttendanceState {
  records: AttendanceRecord[];
  addRecord: (record: Omit<AttendanceRecord, 'id' | 'modifications'>) => void;
  addModification: (recordId: string, modification: Omit<AttendanceModification, 'id'>) => void;
  getRecordsByClass: (classId: string) => AttendanceRecord[];
  getDetailedStats: (classId: string) => AttendanceStats | null;
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set, get) => ({
      records: [],
      addRecord: (record) => {
        const newRecord = {
          ...record,
          id: Math.random().toString(36).substr(2, 9),
          modifications: [],
        };
        set((state) => ({
          records: [...state.records, newRecord],
        }));
      },
      addModification: (recordId, modification) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  modifications: [
                    ...record.modifications,
                    {
                      ...modification,
                      id: Math.random().toString(36).substr(2, 9),
                    },
                  ],
                }
              : record
          ),
        }));
      },
      getRecordsByClass: (classId) => {
        return get().records.filter((record) => record.classId === classId);
      },
      getDetailedStats: (classId) => {
        const records = get().getRecordsByClass(classId);
        if (records.length === 0) return null;

        const studentStats: Record<string, {
          absences: number;
          absenceDates: string[];
          modifications: AttendanceModification[];
        }> = {};

        records.forEach((record) => {
          record.absentStudents.forEach((studentId) => {
            if (!studentStats[studentId]) {
              studentStats[studentId] = {
                absences: 0,
                absenceDates: [],
                modifications: [],
              };
            }
            studentStats[studentId].absences += 1;
            studentStats[studentId].absenceDates.push(record.date);
            studentStats[studentId].modifications.push(...record.modifications.filter(
              (mod) => mod.studentId === studentId
            ));
          });
        });

        return {
          month: new Date().toLocaleString('pt-BR', { month: 'long' }),
          year: new Date().getFullYear(),
          totalAbsences: Object.values(studentStats).reduce(
            (total, stats) => total + stats.absences,
            0
          ),
          students: Object.entries(studentStats).map(([id, stats]) => ({
            id,
            name: '',
            ...stats,
          })),
        };
      },
    }),
    {
      name: 'attendance-storage',
    }
  )
);