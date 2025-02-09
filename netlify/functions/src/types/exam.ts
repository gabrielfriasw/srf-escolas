import { Student } from './student';
import { Class } from './class';

export interface ExamSession {
  id: string;
  name: string;
  date: string;
  status: 'pending' | 'in_progress' | 'completed';
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface ExamAllocation {
  id: string;
  exam_session_id: string;
  student_id: string;
  original_class_id: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  student?: Student;
  original_class?: Class;
}

export interface ExamAttendance {
  id: string;
  exam_session_id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  owner_id: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  student?: Student;
}

export interface ExamSeating {
  id: string;
  exam_session_id: string;
  student_id: string;
  position_x: number;
  position_y: number;
  owner_id: string;
  created_at: string;
  updated_at: string;
  // Relacionamentos
  student?: Student;
}