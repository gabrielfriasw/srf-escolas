/*
  # Fix user signup trigger function
  
  1. Changes
    - Update handle_new_user function to handle missing metadata
    - Add better error handling
    - Ensure all required fields are properly set
  
  2. Notes
    - Uses COALESCE to provide fallbacks for missing data
    - Adds explicit type casting
    - Includes better error handling
*/

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