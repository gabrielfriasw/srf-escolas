import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from './supabase';

let classesChannel: RealtimeChannel;
let attendanceChannel: RealtimeChannel;

export const initializeRealtime = () => {
  // Subscribe to classes changes
  classesChannel = supabase
    .channel('classes_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'classes',
      },
      (payload) => {
        console.log('Classes change received!', payload);
        // Dispatch event for store to handle
        window.dispatchEvent(
          new CustomEvent('CLASSES_UPDATED', {
            detail: payload,
          })
        );
      }
    )
    .subscribe();

  // Subscribe to attendance changes
  attendanceChannel = supabase
    .channel('attendance_channel')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'attendance_records',
      },
      (payload) => {
        console.log('Attendance change received!', payload);
        // Dispatch event for store to handle
        window.dispatchEvent(
          new CustomEvent('ATTENDANCE_UPDATED', {
            detail: payload,
          })
        );
      }
    )
    .subscribe();
};

export const cleanupRealtime = () => {
  if (classesChannel) {
    supabase.removeChannel(classesChannel);
  }
  if (attendanceChannel) {
    supabase.removeChannel(attendanceChannel);
  }
};