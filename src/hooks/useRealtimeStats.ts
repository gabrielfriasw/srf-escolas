import { useEffect } from 'react';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { supabase } from '../lib/supabase/supabase';

export const useRealtimeStats = (classId: string) => {
  const { fetchAttendance } = useAttendanceStore();

  useEffect(() => {
    // Inscreve-se nas mudanças da tabela attendance_records
    const channel = supabase
      .channel('attendance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'attendance_records',
          filter: `class_id=eq.${classId}`,
        },
        () => {
          // Atualiza os dados quando houver mudanças
          fetchAttendance(classId);
        }
      )
      .subscribe();

    // Cleanup na desmontagem
    return () => {
      supabase.removeChannel(channel);
    };
  }, [classId, fetchAttendance]);
};