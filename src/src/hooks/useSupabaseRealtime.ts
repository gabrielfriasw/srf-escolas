import { useEffect } from 'react';
import { useClassStore } from '../store/useClassStore';
import { useAttendanceStore } from '../store/useAttendanceStore';
import { initializeRealtime, cleanupRealtime } from '../lib/supabase/realtime';

export const useSupabaseRealtime = () => {
  const { fetchClasses } = useClassStore();
  const { fetchAttendance } = useAttendanceStore();

  useEffect(() => {
    // Initialize realtime subscriptions
    initializeRealtime();

    // Listen for realtime updates
    const handleClassesUpdate = () => {
      fetchClasses();
    };

    const handleAttendanceUpdate = () => {
      fetchAttendance();
    };

    window.addEventListener('CLASSES_UPDATED', handleClassesUpdate);
    window.addEventListener('ATTENDANCE_UPDATED', handleAttendanceUpdate);

    return () => {
      // Cleanup subscriptions and event listeners
      cleanupRealtime();
      window.removeEventListener('CLASSES_UPDATED', handleClassesUpdate);
      window.removeEventListener('ATTENDANCE_UPDATED', handleAttendanceUpdate);
    };
  }, [fetchClasses, fetchAttendance]);
};