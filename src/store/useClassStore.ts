import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Class } from '../types';

interface ClassState {
  classes: Class[];
  addClass: (newClass: Omit<Class, 'id'>) => void;
  removeClass: (id: string) => void;
  updateClass: (id: string, updatedClass: Partial<Class>) => void;
  getClassesByUser: (userId: string, userRole: string) => Class[];
  assignTeacherToClass: (classId: string, teacherId: string) => void;
  removeTeacherFromClass: (classId: string, teacherId: string) => void;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      classes: [],
      addClass: (newClass) =>
        set((state) => ({
          classes: [
            ...state.classes,
            { ...newClass, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      removeClass: (id) =>
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        })),
      updateClass: (id, updatedClass) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...updatedClass } : c
          ),
        })),
      getClassesByUser: (userId: string, userRole: string) => {
        const state = get();
        if (userRole === 'DIRECTOR') {
          return state.classes;
        }
        return state.classes.filter(
          (c) => c.teachers.includes(userId) || c.createdBy === userId
        );
      },
      assignTeacherToClass: (classId: string, teacherId: string) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId && !c.teachers.includes(teacherId)
              ? { ...c, teachers: [...c.teachers, teacherId] }
              : c
          ),
        })),
      removeTeacherFromClass: (classId: string, teacherId: string) =>
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId
              ? { ...c, teachers: c.teachers.filter((id) => id !== teacherId) }
              : c
          ),
        })),
    }),
    {
      name: 'class-storage',
    }
  )
);