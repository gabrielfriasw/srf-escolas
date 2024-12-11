import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Classroom, Student } from '../types';

interface Store {
  user: User | null;
  classrooms: Classroom[];
  darkMode: boolean;
  setUser: (user: User | null) => void;
  setDarkMode: (darkMode: boolean) => void;
  addClassroom: (classroom: Classroom) => void;
  updateClassroom: (classroom: Classroom) => void;
  deleteClassroom: (id: string) => void;
  addStudent: (classroomId: string, student: Student) => void;
  removeStudent: (classroomId: string, studentId: string) => void;
  updateStudentPosition: (
    classroomId: string,
    studentId: string,
    position: { row: number; column: number }
  ) => void;
  updatePedagoguePhone: (classroomId: string, phone: string) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      classrooms: [],
      darkMode: false,
      setUser: (user) => set({ user }),
      setDarkMode: (darkMode) => set({ darkMode }),
      addClassroom: (classroom) =>
        set((state) => ({ classrooms: [...state.classrooms, classroom] })),
      updateClassroom: (classroom) =>
        set((state) => ({
          classrooms: state.classrooms.map((c) =>
            c.id === classroom.id ? classroom : c
          ),
        })),
      deleteClassroom: (id) =>
        set((state) => ({
          classrooms: state.classrooms.filter((c) => c.id !== id),
        })),
      addStudent: (classroomId, student) =>
        set((state) => ({
          classrooms: state.classrooms.map((c) =>
            c.id === classroomId
              ? { ...c, students: [...c.students, student] }
              : c
          ),
        })),
      removeStudent: (classroomId, studentId) =>
        set((state) => ({
          classrooms: state.classrooms.map((c) =>
            c.id === classroomId
              ? { ...c, students: c.students.filter((s) => s.id !== studentId) }
              : c
          ),
        })),
      updateStudentPosition: (classroomId, studentId, position) =>
        set((state) => ({
          classrooms: state.classrooms.map((c) =>
            c.id === classroomId
              ? {
                  ...c,
                  students: c.students.map((s) =>
                    s.id === studentId ? { ...s, position } : s
                  ),
                }
              : c
          ),
        })),
      updatePedagoguePhone: (classroomId, phone) =>
        set((state) => ({
          classrooms: state.classrooms.map((c) =>
            c.id === classroomId ? { ...c, pedagoguePhone: phone } : c
          ),
        })),
    }),
    {
      name: 'attendance-storage',
    }
  )
);