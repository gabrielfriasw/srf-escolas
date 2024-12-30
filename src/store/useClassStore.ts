import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Class } from '../types';

interface ClassState {
  classes: Class[];
  addClass: (newClass: Omit<Class, 'id'>) => void;
  removeClass: (id: string) => void;
  updateClass: (id: string, updatedClass: Partial<Class>) => void;
  getClassesByUser: (userId: string, userRole: string) => Class[];
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
        // Tanto coordenadores quanto professores veem todas as turmas
        if (userRole === 'COORDINATOR' || userRole === 'TEACHER') {
          return state.classes;
        }
        return [];
      },
    }),
    {
      name: 'class-storage',
    }
  )
);