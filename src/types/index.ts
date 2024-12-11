export interface User {
  id: string;
  name: string;
  email: string;
  role: 'coordinator' | 'teacher' | 'monitor';
}

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  position: {
    row: number;
    column: number;
  };
}

export interface Classroom {
  id: string;
  name: string;
  pedagoguePhone: string;
  students: Student[];
  rows: number;
  columns: number;
}

export interface AttendanceRecord {
  date: string;
  classroomId: string;
  absentStudents: Student[];
}