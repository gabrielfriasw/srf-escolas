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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: 'DIRECTOR' | 'COORDINATOR' | 'TEACHER'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'DIRECTOR' | 'COORDINATOR' | 'TEACHER'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'DIRECTOR' | 'COORDINATOR' | 'TEACHER'
          created_at?: string
          updated_at?: string
        }
      }
      class_teachers: {
        Row: {
          class_id: string
          teacher_id: string
          status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          assigned_at: string
          updated_at: string
        }
        Insert: {
          class_id: string
          teacher_id: string
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          assigned_at?: string
          updated_at?: string
        }
        Update: {
          class_id?: string
          teacher_id?: string
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          assigned_at?: string
          updated_at?: string
        }
      }
    }
  }
}