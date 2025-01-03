import { useEffect } from 'react';
import { useClassStore } from '../../store/useClassStore';
import { supabase } from '../../lib/supabase/supabase';

export const useClassesRealtime = () => {
  const { fetchClasses } = useClassStore();

  useEffect(() => {
    const channel = supabase
      .channel('classes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'classes',
        },
        () => {
          fetchClasses();
        }
      )
      .subscribe();

    // Initial fetch
    fetchClasses();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchClasses]);
};