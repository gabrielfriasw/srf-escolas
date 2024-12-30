/*
  # Class Teachers Improvements Migration
  
  1. Schema Changes
    - Add status column to class_teachers table
    - Add updated_at column with automatic updates
    - Add unique constraint to profiles email
  
  2. Triggers
    - Create updated_at trigger for class_teachers
  
  3. Security
    - Add RLS policies for teacher assignments
    - Improve class visibility policies
*/

-- Add unique constraint to profiles email
ALTER TABLE profiles 
ADD CONSTRAINT profiles_email_unique UNIQUE (email);

-- Add new columns to class_teachers
ALTER TABLE class_teachers 
ADD COLUMN status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for class_teachers updated_at
CREATE TRIGGER set_timestamp
  BEFORE UPDATE ON class_teachers
  FOR EACH ROW
  EXECUTE FUNCTION trigger_set_timestamp();

-- RLS Policies for class_teachers

-- Allow teachers to view their own assignments
CREATE POLICY "Teachers can view own assignments"
  ON class_teachers FOR SELECT
  USING (auth.uid() = teacher_id);

-- Allow teachers to accept/reject their assignments
CREATE POLICY "Teachers can accept/reject own assignments"
  ON class_teachers FOR UPDATE
  USING (auth.uid() = teacher_id)
  WITH CHECK (
    status IN ('ACCEPTED', 'REJECTED')
  );

-- Allow class owners to view all assignments
CREATE POLICY "Class owners can view assignments"
  ON class_teachers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id 
      AND owner_id = auth.uid()
    )
  );

-- Update class visibility policy
CREATE POLICY "Classes visible to accepted teachers"
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