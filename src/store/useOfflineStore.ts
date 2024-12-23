import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OfflineState {
  pendingChanges: Array<{
    id: string;
    type: 'class' | 'student' | 'attendance';
    action: 'create' | 'update' | 'delete';
    data: any;
    timestamp: number;
  }>;
  isOnline: boolean;
  addPendingChange: (change: Omit<OfflineState['pendingChanges'][0], 'id' | 'timestamp'>) => void;
  removePendingChange: (id: string) => void;
  setOnlineStatus: (status: boolean) => void;
  clearPendingChanges: () => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      pendingChanges: [],
      isOnline: navigator.onLine,
      
      addPendingChange: (change) => set((state) => ({
        pendingChanges: [
          ...state.pendingChanges,
          {
            ...change,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
          },
        ],
      })),
      
      removePendingChange: (id) => set((state) => ({
        pendingChanges: state.pendingChanges.filter((change) => change.id !== id),
      })),
      
      setOnlineStatus: (status) => set({ isOnline: status }),
      
      clearPendingChanges: () => set({ pendingChanges: [] }),
    }),
    {
      name: 'offline-store',
    }
  )
);