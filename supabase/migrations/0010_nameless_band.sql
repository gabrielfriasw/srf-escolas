/*
  # Fix User Creation Trigger
  
  1. Changes
    - Drop and recreate handle_new_user function with better error handling
    - Add explicit type casting
    - Add default values for missing fields
    
  2. Security
    - Maintain SECURITY DEFINER to ensure function runs with necessary privileges
*/

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Recreate function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  default_role text := 'TEACHER';
BEGIN
  -- Insert into profiles with proper error handling
  BEGIN
    INSERT INTO public.profiles (
      id,
      name,
      email,
      role,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      LOWER(NEW.email),
      COALESCE(
        (NEW.raw_user_meta_data->>'role')::text,
        default_role
      ),
      NOW(),
      NOW()
    );
  EXCEPTION 
    WHEN unique_violation THEN
      -- Log error and continue
      RAISE NOTICE 'Profile already exists for user %', NEW.id;
    WHEN OTHERS THEN
      -- Log error details
      RAISE NOTICE 'Error creating profile: %', SQLERRM;
      RETURN NULL;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();