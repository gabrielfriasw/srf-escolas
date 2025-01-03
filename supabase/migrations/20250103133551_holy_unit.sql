/*
  # Update Classes RLS Policy
  
  1. Changes
    - Drop existing insert policy
    - Create new insert policy with proper auth check
    
  2. Security
    - Allow authenticated users to insert classes
    - Ensure owner_id matches the authenticated user
*/

-- Drop existing insert policy if exists
DROP POLICY IF EXISTS "Classes can be inserted by authenticated users" ON classes;

-- Create new insert policy
CREATE POLICY "Classes can be inserted by authenticated users" ON classes
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = owner_id);