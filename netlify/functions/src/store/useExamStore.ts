import { create } from 'zustand';
import { examService } from '../lib/supabase/services/exam.service';
import type { ExamSession } from '../types/exam';

interface ExamState {
  sessions: ExamSession[];
  loading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  createSession: (session: Omit<ExamSession, 'id' | 'created_at' | 'updated_at'>) => Promise<ExamSession>;
  deleteSession: (sessionId: string) => Promise<void>;
}

export const useExamStore = create<ExamState>((set, get) => ({
  sessions: [],
  loading: false,
  error: null,

  fetchSessions: async () => {
    try {
      set({ loading: true, error: null });
      const sessions = await examService.getSessions();
      set({ sessions });
    } catch (error) {
      console.error('Error fetching sessions:', error);
      set({ error: error instanceof Error ? error.message : 'Erro ao carregar sessões' });
    } finally {
      set({ loading: false });
    }
  },

  createSession: async (session) => {
    try {
      set({ loading: true, error: null });
      const newSession = await examService.createSession(session);
      await get().fetchSessions(); // Fetch all sessions after creation
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteSession: async (sessionId) => {
    try {
      set({ loading: true, error: null });
      await examService.deleteSession(sessionId);
      set(state => ({
        sessions: state.sessions.filter(s => s.id !== sessionId)
      }));
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));