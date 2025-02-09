-- Drop existing tables to recreate them with proper relationships
DROP TABLE IF EXISTS attendance_details CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('COORDINATOR', 'TEACHER')),
  theme_preference text NOT NULL DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  grade text NOT NULL,
  pedagogist_phone text NOT NULL,
  shift text NOT NULL CHECK (shift IN ('morning', 'afternoon', 'night')),
  owner_id uuid REFERENCES profiles(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create students table with proper foreign key
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  number integer NOT NULL,
  position_x float,
  position_y float,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_student_number_per_class UNIQUE (class_id, number)
);

-- Create incidents table
CREATE TABLE incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('Atraso', 'Comportamento Inadequado', 'Elogio', 'Outros')),
  date date NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE attendance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create attendance_details table
CREATE TABLE attendance_details (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id uuid REFERENCES attendance_records(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES students(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('P', 'F')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_details ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Classes policies
CREATE POLICY "Classes are viewable by everyone" ON classes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Classes can be inserted by authenticated users" ON classes
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Classes can be updated by owner" ON classes
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

CREATE POLICY "Classes can be deleted by owner" ON classes
  FOR DELETE TO authenticated USING (auth.uid() = owner_id);

-- Students policies
CREATE POLICY "Students are viewable by everyone" ON students
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Students can be managed by class owner" ON students
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = students.class_id 
      AND classes.owner_id = auth.uid()
    )
  );

-- Incidents policies
CREATE POLICY "Incidents are viewable by everyone" ON incidents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Incidents can be managed by class owner" ON incidents
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM students 
      JOIN classes ON classes.id = students.class_id 
      WHERE students.id = incidents.student_id 
      AND classes.owner_id = auth.uid()
    )
  );

-- Attendance records policies
CREATE POLICY "Attendance records are viewable by everyone" ON attendance_records
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Attendance records can be managed by class owner" ON attendance_records
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM classes 
      WHERE classes.id = attendance_records.class_id 
      AND classes.owner_id = auth.uid()
    )
  );

-- Attendance details policies
CREATE POLICY "Attendance details are viewable by everyone" ON attendance_details
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Attendance details can be managed by class owner" ON attendance_details
  FOR ALL TO authenticated USING (
    EXISTS (
      SELECT 1 FROM attendance_records
      JOIN classes ON classes.id = attendance_records.class_id
      WHERE attendance_records.id = attendance_details.record_id
      AND classes.owner_id = auth.uid()
    )
  );

-- Create function to handle profile creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Ensure raw_user_meta_data is not null
  IF NEW.raw_user_meta_data IS NULL THEN
    NEW.raw_user_meta_data := '{}'::jsonb;
  END IF;

  -- Insert new profile with proper fallbacks
  INSERT INTO public.profiles (
    id,
    email,
    name,
    role,
    theme_preference
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'TEACHER'),
    'light'
  );

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updating timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON students
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_incidents_updated_at
  BEFORE UPDATE ON incidents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_attendance_details_updated_at
  BEFORE UPDATE ON attendance_details
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();