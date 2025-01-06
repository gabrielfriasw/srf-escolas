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
    (set) => ({
      classes: [],
      loading: false,
      error: null,
      fetchClasses: async () => {
        try {
          set({ loading: true, error: null });
          const data = await classesService.getClasses();
          set({ classes: data });
        } catch (error) {
          console.error('Error fetching classes:', error);
          set({ error: 'Erro ao buscar turmas' });
        } finally {
          set({ loading: false });
        }
      },
      addClass: async (newClass) => {
        try {
          set({ loading: true, error: null });
          const createdClass = await classesService.createClass(newClass);
          set((state) => ({
            classes: [createdClass, ...state.classes],
          }));
        } catch (error) {
          console.error('Error adding class:', error);
          set({ error: 'Erro ao criar turma' });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
      removeClass: async (id) => {
        try {
          set({ loading: true, error: null });
          await classesService.deleteClass(id);
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
          const updatedClass = await classesService.updateClass(id, updates);
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