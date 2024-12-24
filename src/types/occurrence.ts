export type OccurrenceType = 'DELAY' | 'BEHAVIOR' | 'PRAISE' | 'OTHER';

export interface Occurrence {
  id: string;
  studentId: string;
  classId: string;
  type: OccurrenceType;
  date: string;
  description: string;
  teacherId: string;
  teacherName: string;
}