import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Class } from '../types';
import { supabase } from '../lib/supabase/supabase';

interface Class {
  id: string;
  name: string;
  grade: string;
  pedagogist_phone: string;
  shift: 'morning' | 'afternoon' | 'night';
  owner_id: string;
  students?: any[];
}

interface ClassState {
  classes: Class[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  addClass: (classData: Omit<Class, 'id' | 'students'>) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
  updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set) => ({
      classes: [],
      loading: false,
      error: null,
      fetchClasses: async () => {
        try {
          set({ loading: true, error: null });
          const { data: classes, error } = await supabase
            .from('classes')
            .select(`
              *,
              students (
                id,
                name,
                number
              )
            `)
            .order('name');

          if (error) throw error;

          set({ classes: classes || [] });
        } catch (error) {
          console.error('Error fetching classes:', error);
          set({ error: error instanceof Error ? error.message : 'Erro ao carregar turmas' });
        } finally {
          set({ loading: false });
        }
      },
      addClass: async (classData) => {
        try {
          set({ loading: true, error: null });
          const createdClass = await supabase
            .from('classes')
            .insert([classData])
            .select()
            .single();
          set((state) => ({
            classes: [createdClass, ...state.classes],
            error: null
          }));
        } catch (error) {
          console.error('Error adding class:', error);
          const errorMessage = error instanceof Error ? error.message : 'Erro ao criar turma';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      removeClass: async (id) => {
        try {
          set({ loading: true, error: null });
          await supabase
            .from('classes')
            .delete()
            .eq('id', id);
          set((state) => ({
            classes: state.classes.filter((c) => c.id !== id),
          }));
        } catch (error) {
          console.error('Error removing class:', error);
          set({ error: 'Erro ao remover turma' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      updateClass: async (id, updates) => {
        try {
          set({ loading: true, error: null });
          const updatedClass = await supabase
            .from('classes')
            .update({ id, ...updates })
            .select()
            .single();
          set((state) => ({
            classes: state.classes.map((c) =>
              c.id === id ? { ...c, ...updatedClass } : c
            ),
          }));
        } catch (error) {
          console.error('Error updating class:', error);
          set({ error: 'Erro ao atualizar turma' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'class-storage',
    }
  )
);