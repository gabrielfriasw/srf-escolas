export type UserRole = 'COORDINATOR' | 'TEACHER';

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
  incidents: Incident[];
}

export interface Incident {
  id: string;
  studentId: string;
  type: 'Atraso' | 'Comportamento Inadequado' | 'Elogio' | 'Outros';
  date: string;
  description: string;
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
  shift: 'morning' | 'afternoon' | 'night';
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
  averageAttendance: number;
  students: Array<{
    id: string;
    name: string;
    absences: number;
  }>;
}