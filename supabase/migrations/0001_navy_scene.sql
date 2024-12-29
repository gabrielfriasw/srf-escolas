/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - Armazena informações dos usuários
      - Vinculado à tabela auth.users do Supabase
      - Campos para nome, cargo e outras informações do usuário
    
    - `classes`
      - Armazena informações das turmas
      - Campos para nome, série, turno e outras informações da turma
    
    - `class_teachers`
      - Tabela de junção para relacionamento many-to-many entre professores e turmas
      - Permite que múltiplos professores sejam atribuídos a uma turma
    
    - `students`
      - Armazena informações dos alunos
      - Vinculado à turma através do class_id
      - Campos para nome, número e posição na sala
    
    - `incidents`
      - Armazena ocorrências dos alunos
      - Vinculado ao aluno através do student_id
      
    - `attendance_records`
      - Registra presenças e faltas
      - Vinculado à turma e ao aluno

  2. Security
    - RLS habilitado em todas as tabelas
    - Políticas específicas para cada tipo de usuário (diretor, coordenador, professor)
    - Proteção contra modificações não autorizadas
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('DIRECTOR', 'COORDINATOR', 'TEACHER')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade text NOT NULL,
  shift text NOT NULL CHECK (shift IN ('morning', 'afternoon', 'night')),
  pedagogist_phone text NOT NULL,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create class_teachers junction table
CREATE TABLE class_teachers (
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by uuid REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  PRIMARY KEY (class_id, teacher_id)
);

-- Create students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  name text NOT NULL,
  number integer NOT NULL,
  position_x float,
  position_y float,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(class_id, number)
);

-- Create incidents table
CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('Atraso', 'Comportamento Inadequado', 'Elogio', 'Outros')),
  date date NOT NULL,
  description text NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  date date NOT NULL,
  status text NOT NULL CHECK (status IN ('P', 'F')),
  recorded_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  UNIQUE(class_id, student_id, date)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Classes policies
CREATE POLICY "Classes are viewable by owner and assigned teachers"
  ON classes FOR SELECT
  USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM class_teachers 
      WHERE class_id = id AND teacher_id = auth.uid()
    )
  );

CREATE POLICY "Directors and coordinators can create classes"
  ON classes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('DIRECTOR', 'COORDINATOR')
    )
  );

CREATE POLICY "Only owner can update class"
  ON classes FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Only owner can delete class"
  ON classes FOR DELETE
  USING (auth.uid() = owner_id);

-- Class teachers policies
CREATE POLICY "Class teachers assignments are viewable by involved users"
  ON class_teachers FOR SELECT
  USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id AND owner_id = auth.uid()
    )
  );

CREATE POLICY "Only directors can assign teachers"
  ON class_teachers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'DIRECTOR'
    )
  );

-- Students policies
CREATE POLICY "Students are viewable by class owner and teachers"
  ON students FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      LEFT JOIN class_teachers ct ON ct.class_id = c.id
      WHERE c.id = class_id 
      AND (c.owner_id = auth.uid() OR ct.teacher_id = auth.uid())
    )
  );

CREATE POLICY "Class owner and teachers can manage students"
  ON students FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      LEFT JOIN class_teachers ct ON ct.class_id = c.id
      WHERE c.id = class_id 
      AND (c.owner_id = auth.uid() OR ct.teacher_id = auth.uid())
    )
  );

-- Incidents policies
CREATE POLICY "Incidents are viewable by class owner and teachers"
  ON incidents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      LEFT JOIN class_teachers ct ON ct.class_id = c.id
      WHERE s.id = student_id 
      AND (c.owner_id = auth.uid() OR ct.teacher_id = auth.uid())
    )
  );

CREATE POLICY "Class owner and teachers can create incidents"
  ON incidents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM students s
      JOIN classes c ON c.id = s.class_id
      LEFT JOIN class_teachers ct ON ct.class_id = c.id
      WHERE s.id = student_id 
      AND (c.owner_id = auth.uid() OR ct.teacher_id = auth.uid())
    )
  );

-- Attendance records policies
CREATE POLICY "Attendance records are viewable by class owner and teachers"
  ON attendance_records FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      LEFT JOIN class_teachers ct ON ct.class_id = c.id
      WHERE c.id = class_id 
      AND (c.owner_id = auth.uid() OR ct.teacher_id = auth.uid())
    )
  );

CREATE POLICY "Class owner and teachers can manage attendance"
  ON attendance_records FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM classes c
      LEFT JOIN class_teachers ct ON ct.class_id = c.id
      WHERE c.id = class_id 
      AND (c.owner_id = auth.uid() OR ct.teacher_id = auth.uid())
    )
  );

-- Create function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'TEACHER')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_class_teachers_teacher_id ON class_teachers(teacher_id);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_incidents_student_id ON incidents(student_id);
CREATE INDEX idx_attendance_records_class_id ON attendance_records(class_id);
CREATE INDEX idx_attendance_records_student_id ON attendance_records(student_id);
CREATE INDEX idx_attendance_records_date ON attendance_records(date);