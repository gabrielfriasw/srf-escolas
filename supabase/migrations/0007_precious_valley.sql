/*
  # Add class management tables

  1. New Tables
    - classes
      - id (uuid, primary key)
      - name (text)
      - grade (text) 
      - shift (text)
      - pedagogist_phone (text)
      - owner_id (uuid, references profiles)
      - created_at (timestamptz)
      - updated_at (timestamptz)
    
    - class_teachers
      - class_id (uuid, references classes)
      - teacher_id (uuid, references profiles)
      - status (text)
      - assigned_at (timestamptz)
      - updated_at (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for viewing and managing classes
    - Add policies for teacher assignments
*/

-- Create classes table if not exists
CREATE TABLE IF NOT EXISTS classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade text NOT NULL,
  shift text NOT NULL CHECK (shift IN ('morning', 'afternoon', 'night')),
  pedagogist_phone text NOT NULL,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create class_teachers junction table if not exists
CREATE TABLE IF NOT EXISTS class_teachers (
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  assigned_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (class_id, teacher_id)
);

-- Enable RLS
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;

-- Classes policies
CREATE POLICY "Classes are viewable by owner and assigned teachers"
  ON classes FOR SELECT
  USING (
    auth.uid() = owner_id OR 
    EXISTS (
      SELECT 1 FROM class_teachers 
      WHERE class_id = id 
      AND teacher_id = auth.uid()
      AND status = 'ACCEPTED'
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

CREATE POLICY "Teachers can update their assignments"
  ON class_teachers FOR UPDATE
  USING (auth.uid() = teacher_id)
  WITH CHECK (
    auth.uid() = teacher_id AND 
    (NEW.status = 'ACCEPTED' OR NEW.status = 'REJECTED')
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_classes_owner_id ON classes(owner_id);
CREATE INDEX IF NOT EXISTS idx_class_teachers_teacher_id ON class_teachers(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_teachers_class_id ON class_teachers(class_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER set_timestamp_classes
  BEFORE UPDATE ON classes
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_class_teachers
  BEFORE UPDATE ON class_teachers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();