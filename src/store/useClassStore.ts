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
  createMonitorInvite: (classId: string) => Promise<string>;
  acceptMonitorInvite: (token: string) => Promise<void>;
}

export const useClassStore = create<ClassState>((set, get) => {
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
          .insert([{
            name: newClass.name,
            grade: newClass.grade,
            pedagogist_phone: newClass.pedagogistPhone,
            owner_id: newClass.ownerId,
          }])
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

    createMonitorInvite: async (classId: string) => {
      try {
        const { data, error } = await supabase
          .from('monitor_invites')
          .insert([{ class_id: classId }])
          .select()
          .single();

        if (error) throw error;
        return `${window.location.origin}/monitor-invite/${data.token}`;
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },

    acceptMonitorInvite: async (token: string) => {
      try {
        const { data: invite, error: inviteError } = await supabase
          .from('monitor_invites')
          .select('*')
          .eq('token', token)
          .single();

        if (inviteError) throw inviteError;
        if (!invite) throw new Error('Convite não encontrado');
        if (invite.claimed_by) throw new Error('Convite já utilizado');
        if (new Date(invite.expires_at) < new Date()) throw new Error('Convite expirado');

        const { error: updateError } = await supabase
          .from('classes')
          .update({ monitor_id: supabase.auth.getUser().then(({ data }) => data.user?.id) })
          .eq('id', invite.class_id);

        if (updateError) throw updateError;

        const { error: claimError } = await supabase
          .from('monitor_invites')
          .update({
            claimed_by: supabase.auth.getUser().then(({ data }) => data.user?.id),
            claimed_at: new Date().toISOString(),
          })
          .eq('id', invite.id);

        if (claimError) throw claimError;

        await get().fetchClasses();
      } catch (error: any) {
        set({ error: error.message });
        throw error;
      }
    },
  };
});