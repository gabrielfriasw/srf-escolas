/*
  # Add theme preference to profiles
  
  1. Changes
    - Add theme_preference column to profiles table
    - Set default value to 'light'
    - Add check constraint to ensure valid values
  
  2. Notes
    - Uses IF NOT EXISTS to prevent errors if column already exists
    - Safe to run multiple times
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'theme_preference'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN theme_preference text 
    DEFAULT 'light' 
    CHECK (theme_preference IN ('light', 'dark'));
  END IF;
END $$;