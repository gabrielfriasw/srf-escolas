// Existing types...

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