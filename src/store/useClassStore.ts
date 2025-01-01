import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Class } from '../types';
import { classesService } from '../lib/supabase/services/classes.service';

interface ClassState {
  classes: Class[];
  loading: boolean;
  error: string | null;
  fetchClasses: () => Promise<void>;
  addClass: (newClass: Omit<Class, 'id' | 'students'>) => Promise<void>;
  removeClass: (id: string) => Promise<void>;
  updateClass: (id: string, updates: Partial<Class>) => Promise<void>;
}

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      classes: [],
      loading: false,
      error: null,
      fetchClasses: async () => {
        try {
          set({ loading: true, error: null });
          const data = await classesService.getClasses();
          set({ classes: data || [] });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao buscar turmas';
          set({ error: message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      addClass: async (newClass) => {
        try {
          set({ loading: true, error: null });
          await classesService.createClass(newClass);
          // Fetch updated classes list
          await get().fetchClasses();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao criar turma';
          set({ error: message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      removeClass: async (id) => {
        try {
          set({ loading: true, error: null });
          await classesService.deleteClass(id);
          set(state => ({
            classes: state.classes.filter(c => c.id !== id)
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao remover turma';
          set({ error: message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      updateClass: async (id, updates) => {
        try {
          set({ loading: true, error: null });
          await classesService.updateClass(id, updates);
          // Fetch updated classes list
          await get().fetchClasses();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Erro ao atualizar turma';
          set({ error: message });
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