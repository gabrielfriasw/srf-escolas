// Add these interfaces to the existing types
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