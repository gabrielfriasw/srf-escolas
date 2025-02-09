-- Drop existing RLS policies for classes
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON classes;
DROP POLICY IF EXISTS "Classes can be created by authenticated users" ON classes;
DROP POLICY IF EXISTS "Classes can be updated by owner" ON classes;
DROP POLICY IF EXISTS "Classes can be deleted by owner" ON classes;

-- Create new RLS policies for classes with proper checks
CREATE POLICY "Classes are viewable by everyone"
ON classes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Classes can be created by authenticated users"
ON classes FOR INSERT
TO authenticated
WITH CHECK (
  -- Ensure owner_id matches the authenticated user
  auth.uid() = owner_id AND
  -- Basic validation checks
  name IS NOT NULL AND
  grade IS NOT NULL AND
  pedagogist_phone IS NOT NULL AND
  shift IN ('morning', 'afternoon', 'night')
);

CREATE POLICY "Classes can be updated by owner"
ON classes FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id)
WITH CHECK (
  -- Validation checks for updates
  name IS NOT NULL AND
  grade IS NOT NULL AND
  pedagogist_phone IS NOT NULL AND
  shift IN ('morning', 'afternoon', 'night')
);

CREATE POLICY "Classes can be deleted by owner"
ON classes FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);

-- Ensure RLS is enabled
ALTER TABLE classes FORCE ROW LEVEL SECURITY;