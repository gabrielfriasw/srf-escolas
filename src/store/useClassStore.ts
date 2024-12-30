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
      addClass: (newClass) => {
        const newId = Math.random().toString(36).substr(2, 9);
        const classWithId = { ...newClass, id: newId };
        
        set((state) => {
          const updatedClasses = [...state.classes, classWithId];
          return { classes: updatedClasses };
        });
      },
      removeClass: (id) => {
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id)
        }));
      },
      updateClass: (id, updatedClass) => {
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...updatedClass } : c
          )
        }));
      },
      getClassesByUser: (userId: string, userRole: string) => {
        const state = get();
        if (userRole === 'COORDINATOR' || userRole === 'TEACHER') {
          return state.classes;
        }
        return state.classes.filter(c => c.ownerId === userId);
      },
    }),
    {
      name: 'class-storage',
      version: 1, // Adicionando versionamento ao storage
    }
  )
);