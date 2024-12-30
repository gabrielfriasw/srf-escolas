import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Class } from '../types';
import { classService } from '../services/database/classService';

interface ClassState {
  classes: Class[];
  lastUpdate: number;
  addClass: (newClass: Omit<Class, 'id'>) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
  updateClass: (id: string, updatedClass: Partial<Class>) => Promise<void>;
  getClassesByUser: (userId: string, userRole: string) => Class[];
  checkForUpdates: () => Promise<void>;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      classes: [],
      lastUpdate: Date.now(),

      addClass: async (newClass) => {
        const createdClass = await classService.addClass(newClass);
        set((state) => ({
          classes: [...state.classes, createdClass],
          lastUpdate: Date.now()
        }));
      },

      removeClass: async (id) => {
        await classService.removeClass(id);
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
          lastUpdate: Date.now()
        }));
      },

      updateClass: async (id, updatedClass) => {
        // Implementar atualização no banco
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...updatedClass } : c
          ),
          lastUpdate: Date.now()
        }));
      },

      getClassesByUser: (userId: string, userRole: string) => {
        const state = get();
        if (userRole === 'COORDINATOR' || userRole === 'TEACHER') {
          return state.classes;
        }
        return state.classes.filter(c => c.ownerId === userId);
      },

      checkForUpdates: async () => {
        const classes = await classService.getAllClasses();
        set({
          classes,
          lastUpdate: Date.now()
        });
      },
    }),
    {
      name: 'class-storage',
    }
  )
);