import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Occurrence } from '../types/occurrence';

interface OccurrenceState {
  occurrences: Occurrence[];
  addOccurrence: (occurrence: Omit<Occurrence, 'id'>) => void;
  getStudentOccurrences: (studentId: string) => Occurrence[];
  getClassOccurrences: (classId: string) => Occurrence[];
}

export const useOccurrenceStore = create<OccurrenceState>()(
  persist(
    (set, get) => ({
      occurrences: [],
      addOccurrence: (occurrence) => {
        const newOccurrence = {
          ...occurrence,
          id: Math.random().toString(36).substr(2, 9),
        };
        set((state) => ({
          occurrences: [...state.occurrences, newOccurrence],
        }));
      },
      getStudentOccurrences: (studentId) => {
        return get().occurrences.filter((o) => o.studentId === studentId);
      },
      getClassOccurrences: (classId) => {
        return get().occurrences.filter((o) => o.classId === classId);
      },
    }),
    {
      name: 'occurrence-storage',
    }
  )
);