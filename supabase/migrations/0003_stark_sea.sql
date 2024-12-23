/*
  # Add unique constraints and indexes

  1. Changes
    - Add unique constraint on users email
    - Add indexes for better query performance
*/

-- Add unique constraint on users email
ALTER TABLE users
ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS users_role_idx ON users (role);
CREATE INDEX IF NOT EXISTS classes_owner_monitor_idx ON classes (owner_id, monitor_id);
CREATE INDEX IF NOT EXISTS students_class_idx ON students (class_id);
CREATE INDEX IF NOT EXISTS attendance_class_date_idx ON attendance_records (class_id, date);