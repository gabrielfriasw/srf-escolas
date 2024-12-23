export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'COORDINATOR' | 'TEACHER' | 'STUDENT_MONITOR'
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'COORDINATOR' | 'TEACHER' | 'STUDENT_MONITOR'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'COORDINATOR' | 'TEACHER' | 'STUDENT_MONITOR'
          created_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          grade: string
          pedagogist_phone: string
          owner_id: string
          monitor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          grade: string
          pedagogist_phone: string
          owner_id: string
          monitor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          grade?: string
          pedagogist_phone?: string
          owner_id?: string
          monitor_id?: string | null
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          name: string
          number: number
          class_id: string
          position_x: number | null
          position_y: number | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          number: number
          class_id: string
          position_x?: number | null
          position_y?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          number?: number
          class_id?: string
          position_x?: number | null
          position_y?: number | null
          created_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          class_id: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          class_id: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          date?: string
          created_at?: string
        }
      }
      absent_students: {
        Row: {
          id: string
          record_id: string
          student_id: string
          created_at: string
        }
        Insert: {
          id?: string
          record_id: string
          student_id: string
          created_at?: string
        }
        Update: {
          id?: string
          record_id?: string
          student_id?: string
          created_at?: string
        }
      }
    }
  }
}