import { create } from 'zustand';
import { Class } from '../types';
import { supabase, subscribeToClasses, subscribeToStudents } from '../lib/supabase/supabase';

interface ClassState {
  classes: Class[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  addClass: (newClass: Omit<Class, 'id'>) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
  updateClass: (id: string, updatedClass: Partial<Class>) => Promise<void>;
  setMonitor: (classId: string, monitorId: string) => Promise<void>;
}

export const useClassStore = create<ClassState>((set, get) => {
  // Set up real-time subscriptions
  subscribeToClasses(() => {
    get().fetchClasses();
  });

  subscribeToStudents(() => {
    get().fetchClasses();
  });

  return {
    classes: [],
    loading: false,
    error: null,

    fetchClasses: async () => {
      set({ loading: true, error: null });
      try {
        const { data: classes, error } = await supabase
          .from('classes')
          .select(`
            *,
            students (*)
          `);

        if (error) throw error;
        set({ classes: classes || [], loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },

    addClass: async (newClass) => {
      try {
        const { data, error } = await supabase
          .from('classes')
          .insert([newClass])
          .select()
          .single();

        if (error) throw error;
        set((state) => ({ classes: [...state.classes, { ...data, students: [] }] }));
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    removeClass: async (id) => {
      try {
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', id);

        if (error) throw error;
        set((state) => ({
          classes: state.classes.filter((c) => c.id !== id),
        }));
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    updateClass: async (id, updatedClass) => {
      try {
        const { error } = await supabase
          .from('classes')
          .update(updatedClass)
          .eq('id', id);

        if (error) throw error;
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === id ? { ...c, ...updatedClass } : c
          ),
        }));
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    setMonitor: async (classId: string, monitorId: string) => {
      try {
        const { error } = await supabase
          .from('classes')
          .update({ monitor_id: monitorId })
          .eq('id', classId);

        if (error) throw error;
        set((state) => ({
          classes: state.classes.map((c) =>
            c.id === classId ? { ...c, monitorId } : c
          ),
        }));
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },
  };
});