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
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  absentStudents: string[];
  modifications: AttendanceModification[];
}

export interface AttendanceModification {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  type: 'ARRIVAL' | 'OBSERVATION';
  studentId: string;
  details: string;
}

export interface AttendanceStats {
  month: string;
  year: number;
  totalAbsences: number;
  students: Array<{
    id: string;
    name: string;
    absences: number;
    absenceDates: string[];
    modifications: AttendanceModification[];
  }>;
}

export interface PDFReport {
  className: string;
  grade: string;
  generatedBy: string;
  generatedAt: string;
  students: Array<{
    number: number;
    name: string;
    totalAbsences: number;
    absenceDates: string[];
    modifications: AttendanceModification[];
  }>;
}