import { supabase } from '../supabase';

export const profileService = {
  updateThemePreference: async (userId: string, theme: 'light' | 'dark') => {
    const { error } = await supabase
      .from('profiles')
      .update({ theme_preference: theme })
      .eq('id', userId);

    if (error) throw error;
  },

  getThemePreference: async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('theme_preference')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data?.theme_preference as 'light' | 'dark' | null;
  }
};