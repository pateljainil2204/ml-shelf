/*
  # Fix models table schema

  1. Updates
    - Modify description column to allow empty strings
    - Modify framework column to allow empty strings  
    - Modify format column to allow empty strings
    - Ensure tags array handles empty arrays properly
  
  2. Security
    - Maintain existing RLS policies
*/

-- Update columns to handle empty strings better
DO $$
BEGIN
  -- Allow empty strings for description
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'models' AND column_name = 'description'
  ) THEN
    ALTER TABLE models ALTER COLUMN description SET DEFAULT '';
  END IF;

  -- Allow empty strings for framework
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'models' AND column_name = 'framework'
  ) THEN
    ALTER TABLE models ALTER COLUMN framework SET DEFAULT '';
  END IF;

  -- Allow empty strings for format
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'models' AND column_name = 'format'
  ) THEN
    ALTER TABLE models ALTER COLUMN format SET DEFAULT '';
  END IF;

  -- Set default empty array for tags
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'models' AND column_name = 'tags'
  ) THEN
    ALTER TABLE models ALTER COLUMN tags SET DEFAULT '{}';
  END IF;
END $$;