/*
  # Add Teacher Assignment Features

  1. Changes
    - Add status column to class_teachers table
    - Add updated_at column with trigger
    - Add RLS policies for teacher assignments

  2. Security
    - Teachers can only view their own assignments
    - Teachers can only accept/reject their own assignments
    - Class owners can view all assignments for their classes
*/

-- Add status and updated_at to class_teachers
ALTER TABLE class_teachers 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_class_teachers_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_class_teachers_updated_at
  BEFORE UPDATE ON class_teachers
  FOR EACH ROW
  EXECUTE FUNCTION update_class_teachers_updated_at();

-- Update RLS policies
CREATE POLICY "Teachers can view own assignments"
  ON class_teachers FOR SELECT
  USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can accept/reject own assignments"
  ON class_teachers FOR UPDATE
  USING (auth.uid() = teacher_id)
  WITH CHECK (
    auth.uid() = teacher_id AND 
    (NEW.status = 'ACCEPTED' OR NEW.status = 'REJECTED')
  );

CREATE POLICY "Class owners can view assignments"
  ON class_teachers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id AND owner_id = auth.uid()
    )
  );