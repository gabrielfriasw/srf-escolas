-- Drop existing class_teachers table and recreate it
DROP TABLE IF EXISTS class_teachers CASCADE;

CREATE TABLE class_teachers (
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  assigned_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (class_id, teacher_id)
);

-- Enable RLS
ALTER TABLE class_teachers ENABLE ROW LEVEL SECURITY;

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

-- Create indexes
CREATE INDEX idx_class_teachers_teacher_id ON class_teachers(teacher_id);
CREATE INDEX idx_class_teachers_class_id ON class_teachers(class_id);
CREATE INDEX idx_class_teachers_status ON class_teachers(status);