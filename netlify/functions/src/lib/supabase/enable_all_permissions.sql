-- Disable RLS for all tables
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_seating ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON public.classes;
DROP POLICY IF EXISTS "Classes can be inserted by authenticated users" ON public.classes;
DROP POLICY IF EXISTS "Classes can be updated by owner" ON public.classes;
DROP POLICY IF EXISTS "Classes can be deleted by owner" ON public.classes;

-- Enable RLS on classes table
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Recreate policies for classes with broader permissions for testing
CREATE POLICY "Classes are viewable by everyone" ON public.classes
  FOR SELECT USING (true);

CREATE POLICY "Classes can be inserted by authenticated users" ON public.classes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Classes can be updated by owner" ON public.classes
  FOR UPDATE USING (true);

CREATE POLICY "Classes can be deleted by owner" ON public.classes
  FOR DELETE USING (true);

-- Ensure RLS is enabled for related tables
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Create broad policies for students table
DROP POLICY IF EXISTS "Students are viewable by everyone" ON public.students;
CREATE POLICY "Students are viewable by everyone" ON public.students
  FOR SELECT USING (true);

CREATE POLICY "Students can be modified by anyone" ON public.students
  FOR ALL USING (true);

-- Create broad policies for incidents table
DROP POLICY IF EXISTS "Incidents are viewable by everyone" ON public.incidents;
CREATE POLICY "Incidents are viewable by everyone" ON public.incidents
  FOR SELECT USING (true);

CREATE POLICY "Incidents can be modified by anyone" ON public.incidents
  FOR ALL USING (true);

-- Create policies for exam_sessions
DROP POLICY IF EXISTS "Exam sessions are viewable by everyone" ON public.exam_sessions;
CREATE POLICY "Exam sessions are viewable by everyone" ON public.exam_sessions
  FOR SELECT USING (true);

CREATE POLICY "Exam sessions can be modified by anyone" ON public.exam_sessions
  FOR ALL USING (true);

-- Create policies for exam_allocations
DROP POLICY IF EXISTS "Exam allocations are viewable by everyone" ON public.exam_allocations;
CREATE POLICY "Exam allocations are viewable by everyone" ON public.exam_allocations
  FOR SELECT USING (true);

CREATE POLICY "Exam allocations can be modified by anyone" ON public.exam_allocations
  FOR ALL USING (true);

-- Create policies for exam_attendance
DROP POLICY IF EXISTS "Exam attendance is viewable by everyone" ON public.exam_attendance;
CREATE POLICY "Exam attendance is viewable by everyone" ON public.exam_attendance
  FOR SELECT USING (true);

CREATE POLICY "Exam attendance can be modified by anyone" ON public.exam_attendance
  FOR ALL USING (true);

-- Create policies for exam_seating
DROP POLICY IF EXISTS "Exam seating is viewable by everyone" ON public.exam_seating;
CREATE POLICY "Exam seating is viewable by everyone" ON public.exam_seating
  FOR SELECT USING (true);

CREATE POLICY "Exam seating can be modified by anyone" ON public.exam_seating
  FOR ALL USING (true);

-- Grant necessary permissions to authenticated users
GRANT ALL ON public.classes TO authenticated;
GRANT ALL ON public.students TO authenticated;
GRANT ALL ON public.incidents TO authenticated;
GRANT ALL ON public.exam_sessions TO authenticated;
GRANT ALL ON public.exam_allocations TO authenticated;
GRANT ALL ON public.exam_attendance TO authenticated;
GRANT ALL ON public.exam_seating TO authenticated;

-- Grant all permissions to authenticated users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant all permissions to anon users
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Grant all permissions to service_role
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO service_role;
