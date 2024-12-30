import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Class } from '../types';

const STORAGE_KEY = 'class-storage';
const LAST_UPDATE_KEY = 'class-last-update';

interface ClassState {
  classes: Class[];
  lastUpdate: number;
  addClass: (newClass: Omit<Class, 'id'>) => void;
  removeClass: (id: string) => void;
  updateClass: (id: string, updatedClass: Partial<Class>) => void;
  getClassesByUser: (userId: string, userRole: string) => Class[];
  checkForUpdates: () => void;
}

// Função para obter dados do localStorage
const getStorageData = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { state: { classes: [], lastUpdate: Date.now() } };
};

export const useClassStore = create<ClassState>()(
  persist(
    (set, get) => ({
      classes: [],
      lastUpdate: Date.now(),

      addClass: (newClass) => {
        const newId = Math.random().toString(36).substr(2, 9);
        const classWithId = { ...newClass, id: newId };
        
        set((state) => {
          const updatedClasses = [...state.classes, classWithId];
          const newLastUpdate = Date.now();
          
          // Atualiza o timestamp da última modificação
          localStorage.setItem(LAST_UPDATE_KEY, newLastUpdate.toString());
          
          return { 
            classes: updatedClasses,
            lastUpdate: newLastUpdate
          };
        });
      },

      removeClass: (id) => {
        set((state) => {
          const newLastUpdate = Date.now();
          localStorage.setItem(LAST_UPDATE_KEY, newLastUpdate.toString());
          
          return {
            classes: state.classes.filter((c) => c.id !== id),
            lastUpdate: newLastUpdate
          };
        });
      },

      updateClass: (id, updatedClass) => {
        set((state) => {
          const newLastUpdate = Date.now();
          localStorage.setItem(LAST_UPDATE_KEY, newLastUpdate.toString());
          
          return {
            classes: state.classes.map((c) =>
              c.id === id ? { ...c, ...updatedClass } : c
            ),
            lastUpdate: newLastUpdate
          };
        });
      },

      getClassesByUser: (userId: string, userRole: string) => {
        const state = get();
        if (userRole === 'COORDINATOR' || userRole === 'TEACHER') {
          return state.classes;
        }
        return state.classes.filter(c => c.ownerId === userId);
      },

      checkForUpdates: () => {
        const currentData = getStorageData();
        const currentLastUpdate = Number(localStorage.getItem(LAST_UPDATE_KEY)) || 0;
        
        if (currentLastUpdate > get().lastUpdate) {
          set({
            classes: currentData.state.classes,
            lastUpdate: currentLastUpdate
          });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      version: 1,
    }
  )
);