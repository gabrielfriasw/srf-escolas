-- Drop existing policies
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON classes;
DROP POLICY IF EXISTS "Classes can be inserted by authenticated users" ON classes;
DROP POLICY IF EXISTS "Classes can be updated by owner" ON classes;
DROP POLICY IF EXISTS "Classes can be deleted by owner" ON classes;

-- Enable RLS on classes table
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

-- Recreate policies for classes
CREATE POLICY "Classes are viewable by everyone" ON classes
  FOR SELECT USING (true);

CREATE POLICY "Classes can be inserted by authenticated users" ON classes
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Classes can be updated by owner" ON classes
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Classes can be deleted by owner" ON classes
  FOR DELETE USING (auth.uid() = owner_id);

-- Ensure RLS is enabled for related tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_details ENABLE ROW LEVEL SECURITY;

-- Recreate policies for students
DROP POLICY IF EXISTS "Students are viewable by everyone" ON students;
CREATE POLICY "Students are viewable by everyone" ON students
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = students.class_id
    )
  );

-- Recreate policies for incidents
DROP POLICY IF EXISTS "Incidents are viewable by everyone" ON incidents;
CREATE POLICY "Incidents are viewable by everyone" ON incidents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM students 
      WHERE students.id = incidents.student_id
    )
  );

-- Grant necessary permissions to authenticated users
GRANT SELECT ON classes TO authenticated;
GRANT INSERT ON classes TO authenticated;
GRANT UPDATE ON classes TO authenticated;
GRANT DELETE ON classes TO authenticated;

GRANT SELECT ON students TO authenticated;
GRANT INSERT ON students TO authenticated;
GRANT UPDATE ON students TO authenticated;
GRANT DELETE ON students TO authenticated;

GRANT SELECT ON incidents TO authenticated;
GRANT INSERT ON incidents TO authenticated;
GRANT UPDATE ON incidents TO authenticated;
GRANT DELETE ON incidents TO authenticated;

GRANT SELECT ON attendance_records TO authenticated;
GRANT INSERT ON attendance_records TO authenticated;
GRANT UPDATE ON attendance_records TO authenticated;
GRANT DELETE ON attendance_records TO authenticated;

GRANT SELECT ON attendance_details TO authenticated;
GRANT INSERT ON attendance_details TO authenticated;
GRANT UPDATE ON attendance_details TO authenticated;
GRANT DELETE ON attendance_details TO authenticated;
