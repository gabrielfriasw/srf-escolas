import { Database } from '../lib/supabase/database.types';

export type Tables = Database['public']['Tables'];
export type Class = Tables['classes']['Row'];
export type Student = Tables['students']['Row'];
export type Incident = Tables['incidents']['Row'];
export type AttendanceRecord = Tables['attendance_records']['Row'];
export type AttendanceDetail = Tables['attendance_details']['Row'];

// Mapped types for the frontend
export interface ClassWithStudents extends Class {
  students: (Student & {
    incidents: Incident[];
  })[];
}