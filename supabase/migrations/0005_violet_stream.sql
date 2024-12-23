/*
  # Add monitor invites system
  
  1. New Tables
    - `monitor_invites`
      - `id` (uuid, primary key)
      - `class_id` (uuid, references classes)
      - `token` (text, unique)
      - `created_at` (timestamptz)
      - `expires_at` (timestamptz)
      - `claimed_by` (uuid, references users)
      - `claimed_at` (timestamptz)
  
  2. Security
    - Enable RLS on monitor_invites table
    - Add policies for creating and managing invites
*/

-- Create monitor invites table
CREATE TABLE IF NOT EXISTS monitor_invites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id uuid NOT NULL,
  token text UNIQUE NOT NULL DEFAULT gen_random_uuid()::text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  claimed_by uuid REFERENCES users,
  claimed_at timestamptz,
  FOREIGN KEY (class_id) REFERENCES classes (id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE monitor_invites ENABLE ROW LEVEL SECURITY;

-- Policies for monitor invites
CREATE POLICY "Users can read own invites" ON monitor_invites
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = monitor_invites.class_id
      AND classes.owner_id = auth.uid()
    )
    OR
    claimed_by = auth.uid()
  );

CREATE POLICY "Users can create invites for own classes" ON monitor_invites
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = class_id
      AND classes.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own invites" ON monitor_invites
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE classes.id = monitor_invites.class_id
      AND classes.owner_id = auth.uid()
    )
    OR
    (claimed_by IS NULL AND auth.uid() IN (
      SELECT id FROM users WHERE role = 'STUDENT_MONITOR'
    ))
  );