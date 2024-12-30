-- Drop existing policies
DROP POLICY IF EXISTS "Classes are viewable by owner and assigned teachers" ON classes;
DROP POLICY IF EXISTS "Directors and coordinators can create classes" ON classes;
DROP POLICY IF EXISTS "Only owner can update class" ON classes;
DROP POLICY IF EXISTS "Only owner can delete class" ON classes;

-- Create new simplified policies
CREATE POLICY "Classes are viewable by everyone"
  ON classes FOR SELECT
  USING (true);

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

-- Update class_teachers policies to handle access control
DROP POLICY IF EXISTS "Class teachers assignments are viewable by involved users" ON class_teachers;

CREATE POLICY "Class teachers assignments are viewable by involved users"
  ON class_teachers FOR SELECT
  USING (
    auth.uid() = teacher_id OR
    EXISTS (
      SELECT 1 FROM classes c
      WHERE c.id = class_id AND c.owner_id = auth.uid()
    )
  );