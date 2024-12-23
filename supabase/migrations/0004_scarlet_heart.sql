/*
  # Clear users and related data
  
  This migration clears all user data to allow fresh registration
*/

-- Clear all related data first
DELETE FROM absent_students;
DELETE FROM attendance_records;
DELETE FROM students;
DELETE FROM classes;
DELETE FROM users;