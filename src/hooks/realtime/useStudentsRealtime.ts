import { useEffect } from 'react';
import { useClassStore } from '../../store/useClassStore';
import { supabase } from '../../lib/supabase/supabase';

export const useStudentsRealtime = () => {
  const { fetchClasses } = useClassStore();

  useEffect(() => {
    const channel = supabase
      .channel('students_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'students',
        },
        () => {
          fetchClasses();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchClasses]);
};