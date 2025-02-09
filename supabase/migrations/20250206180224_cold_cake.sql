-- Drop existing RLS policies for classes
DROP POLICY IF EXISTS "Classes are viewable by everyone" ON classes;
DROP POLICY IF EXISTS "Classes can be inserted by authenticated users" ON classes;
DROP POLICY IF EXISTS "Classes can be updated by owner" ON classes;
DROP POLICY IF EXISTS "Classes can be deleted by owner" ON classes;

-- Create new RLS policies for classes
CREATE POLICY "Classes are viewable by everyone"
ON classes FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Classes can be created by authenticated users"
ON classes FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Classes can be updated by owner"
ON classes FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);

CREATE POLICY "Classes can be deleted by owner"
ON classes FOR DELETE
TO authenticated
USING (auth.uid() = owner_id);