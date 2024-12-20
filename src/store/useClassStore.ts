import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Class } from '../types';
import { supabase } from '../lib/supabase';

interface ClassState {
  classes: Class[];
  addClass: (newClass: Omit<Class, 'id'>) => void;
  removeClass: (id: string) => void;
  updateClass: (id: string, updatedClass: Partial<Class>) => void;
  getClassesByUser: (userId: string) => Class[];
  setMonitor: (classId: string, monitorId: string) => void;
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
      getClassesByUser: (userId: string) => {
        const state = get();
        return state.classes.filter(
          (c) => c.ownerId === userId || c.monitorId === userId
        );
      },
      setMonitor: async (classId: string, monitorId: string) => {
        // First verify if the monitor exists and has the correct role
        const { data: monitor, error: monitorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', monitorId)
          .eq('role', 'STUDENT_MONITOR')
          .single();

        if (monitorError || !monitor) {
          throw new Error('Monitor não encontrado ou sem permissão adequada');
        }

        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId ? { ...c, monitorId } : c
          ),
        }));
      },
    }),
    {
      name: 'class-storage',
    }
  )
);