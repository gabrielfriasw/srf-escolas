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
          role: 'COORDINATOR' | 'TEACHER' | 'STUDENT_MONITOR'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role: 'COORDINATOR' | 'TEACHER' | 'STUDENT_MONITOR'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: 'COORDINATOR' | 'TEACHER' | 'STUDENT_MONITOR'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}