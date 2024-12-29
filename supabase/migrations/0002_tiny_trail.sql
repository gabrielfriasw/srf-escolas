/*
  # Improve teacher assignment system

  1. Changes
    - Add unique constraint to profiles email
    - Add class_teachers table improvements
    - Add better RLS policies for teacher access
*/

-- Add unique constraint to profiles email if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_email_unique'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_email_unique UNIQUE (email);
  END IF;
END $$;

-- Improve class_teachers table
ALTER TABLE class_teachers 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create function to update class_teachers updated_at
CREATE OR REPLACE FUNCTION update_class_teachers_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for class_teachers updated_at
DROP TRIGGER IF EXISTS set_class_teachers_updated_at ON class_teachers;
CREATE TRIGGER set_class_teachers_updated_at
  BEFORE UPDATE ON class_teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_class_teachers_updated_at();

-- Improve RLS policies for class_teachers
DROP POLICY IF EXISTS "Class teachers assignments are viewable by involved users" ON class_teachers;
CREATE POLICY "Class teachers assignments are viewable by involved users"
  ON class_teachers FOR SELECT
  USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id AND owner_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Teachers can update their own assignments" ON class_teachers;
CREATE POLICY "Teachers can update their own assignments"
  ON class_teachers FOR UPDATE
  USING (auth.uid() = teacher_id)
  WITH CHECK (
    auth.uid() = teacher_id AND 
    (NEW.status = 'ACCEPTED' OR NEW.status = 'REJECTED')
  );

-- Improve classes policies for teacher access
DROP POLICY IF EXISTS "Classes are viewable by owner and assigned teachers" ON classes;
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