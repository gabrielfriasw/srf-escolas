/*
  # Initial Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `created_at` (timestamp)
    
    - `classes`
      - `id` (uuid, primary key) 
      - `name` (text)
      - `grade` (text)
      - `pedagogist_phone` (text)
      - `owner_id` (uuid, references users)
      - `monitor_id` (uuid, references users, nullable)
      - `created_at` (timestamp)

    - `students`
      - `id` (uuid, primary key)
      - `name` (text)
      - `number` (integer)
      - `class_id` (uuid, references classes)
      - `position_x` (float, nullable)
      - `position_y` (float, nullable)
      - `created_at` (timestamp)

    - `attendance_records`
      - `id` (uuid, primary key)
      - `class_id` (uuid, references classes)
      - `date` (timestamp)
      - `created_at` (timestamp)

    - `absent_students`
      - `id` (uuid, primary key)
      - `record_id` (uuid, references attendance_records)
      - `student_id` (uuid, references students)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('COORDINATOR', 'TEACHER', 'STUDENT_MONITOR');

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create classes table
CREATE TABLE classes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  grade text NOT NULL,
  pedagogist_phone text NOT NULL,
  owner_id uuid REFERENCES users NOT NULL,
  monitor_id uuid REFERENCES users,
  created_at timestamptz DEFAULT now()
);

-- Create students table
CREATE TABLE students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  number integer NOT NULL,
  class_id uuid REFERENCES classes NOT NULL,
  position_x float,
  position_y float,
  created_at timestamptz DEFAULT now()
);

-- Create attendance_records table
CREATE TABLE attendance_records (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id uuid REFERENCES classes NOT NULL,
  date timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create absent_students table
CREATE TABLE absent_students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  record_id uuid REFERENCES attendance_records NOT NULL,
  student_id uuid REFERENCES students NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(record_id, student_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE absent_students ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Users policies
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read other users data" ON users
  FOR SELECT TO authenticated
  USING (true);

-- Classes policies
CREATE POLICY "Users can read own classes" ON classes
  FOR SELECT TO authenticated
  USING (
    owner_id = auth.uid() OR 
    monitor_id = auth.uid()
  );

CREATE POLICY "Users can insert own classes" ON classes
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = owner_id AND
    (
      EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role IN ('COORDINATOR', 'TEACHER')
      )
    )
  );

CREATE POLICY "Users can update own classes" ON classes
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can delete own classes" ON classes
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Students policies
CREATE POLICY "Users can read class students" ON students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = students.class_id
      AND (classes.owner_id = auth.uid() OR classes.monitor_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert class students" ON students
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_id
      AND classes.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update class students" ON students
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = students.class_id
      AND (classes.owner_id = auth.uid() OR classes.monitor_id = auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_id
      AND (classes.owner_id = auth.uid() OR classes.monitor_id = auth.uid())
    )
  );

CREATE POLICY "Users can delete class students" ON students
  FOR DELETE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = students.class_id
      AND classes.owner_id = auth.uid()
    )
  );

-- Attendance records policies
CREATE POLICY "Users can read class attendance records" ON attendance_records
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = attendance_records.class_id
      AND (classes.owner_id = auth.uid() OR classes.monitor_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert class attendance records" ON attendance_records
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_id
      AND (classes.owner_id = auth.uid() OR classes.monitor_id = auth.uid())
    )
  );

-- Absent students policies
CREATE POLICY "Users can read class absent students" ON absent_students
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM attendance_records
      JOIN classes ON classes.id = attendance_records.class_id
      WHERE attendance_records.id = absent_students.record_id
      AND (classes.owner_id = auth.uid() OR classes.monitor_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert class absent students" ON absent_students
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM attendance_records
      JOIN classes ON classes.id = attendance_records.class_id
      WHERE attendance_records.id = absent_students.record_id
      AND (classes.owner_id = auth.uid() OR classes.monitor_id = auth.uid())
    )
  );