export type UserRole = 'COORDINATOR' | 'TEACHER' | 'STUDENT_MONITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password: string;
}

export interface Student {
  id: string;
  name: string;
  number: number;
  position?: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface Class {
  id: string;
  name: string;
  grade: string;
  pedagogistPhone: string;
  students: Student[];
  ownerId: string;
  monitorId?: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  absentStudents: string[];
}

export interface AttendanceStats {
  month: string;
  year: number;
  totalAbsences: number;
  students: Array<{
    id: string;
    name: string;
    absences: number;
  }>;
}