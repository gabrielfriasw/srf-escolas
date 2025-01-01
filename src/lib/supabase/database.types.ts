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
      attendance_details: {
        Row: {
          id: string
          record_id: string
          student_id: string
          status: 'P' | 'F'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          record_id: string
          student_id: string
          status: 'P' | 'F'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          record_id?: string
          student_id?: string
          status?: 'P' | 'F'
          created_at?: string
          updated_at?: string
        }
      }
      attendance_records: {
        Row: {
          id: string
          class_id: string
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          grade: string
          pedagogist_phone: string
          shift: 'morning' | 'afternoon' | 'night'
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          grade: string
          pedagogist_phone: string
          shift: 'morning' | 'afternoon' | 'night'
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          grade?: string
          pedagogist_phone?: string
          shift?: 'morning' | 'afternoon' | 'night'
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      incidents: {
        Row: {
          id: string
          student_id: string
          type: 'Atraso' | 'Comportamento Inadequado' | 'Elogio' | 'Outros'
          date: string
          description: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          type: 'Atraso' | 'Comportamento Inadequado' | 'Elogio' | 'Outros'
          date: string
          description: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          type?: 'Atraso' | 'Comportamento Inadequado' | 'Elogio' | 'Outros'
          date?: string
          description?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'COORDINATOR' | 'TEACHER'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'COORDINATOR' | 'TEACHER'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'COORDINATOR' | 'TEACHER'
          created_at?: string
          updated_at?: string
        }
      }
      students: {
        Row: {
          id: string
          class_id: string
          name: string
          number: number
          position_x: number | null
          position_y: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          class_id: string
          name: string
          number: number
          position_x?: number | null
          position_y?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          class_id?: string
          name?: string
          number?: number
          position_x?: number | null
          position_y?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}