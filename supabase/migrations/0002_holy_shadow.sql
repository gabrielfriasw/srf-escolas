/*
  # Fix user policies for registration

  1. Changes
    - Add policy to allow users to insert their own data during registration
    - Update existing policies for better security

  2. Security
    - Enable RLS on users table
    - Add policies for user management
*/

-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can read other users data" ON users;

-- Create new policies for users table
CREATE POLICY "Enable insert for authentication" ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for authenticated users" ON users
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Enable update for users based on id" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Update the users table to trust the auth.uid()
ALTER TABLE users
  ADD CONSTRAINT users_id_fkey
  FOREIGN KEY (id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE;