/*
  # MLShelf Database Schema

  1. New Tables
    - `models` table for storing ML model metadata
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, model name)
      - `description` (text, model description)
      - `file_path` (text, storage path)
      - `size_bytes` (int, file size)
      - `framework` (text, ML framework)
      - `format` (text, model format)
      - `tags` (text[], searchable tags)
      - `downloads` (int, download counter)
      - `created_at` (timestamptz, creation time)

  2. Security
    - Enable RLS on `models` table
    - Public read access for all models
    - Authenticated users can insert their own models
    - Users can only update/delete their own models
*/

CREATE TABLE IF NOT EXISTS models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  file_path text NOT NULL,
  size_bytes int NOT NULL,
  framework text,
  format text,
  tags text[],
  downloads int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Public can read all models
CREATE POLICY "Models are publicly readable"
  ON models
  FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert models
CREATE POLICY "Authenticated users can insert models"
  ON models
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own models
CREATE POLICY "Users can update own models"
  ON models
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own models
CREATE POLICY "Users can delete own models"
  ON models
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_models_user_id ON models(user_id);
CREATE INDEX IF NOT EXISTS idx_models_created_at ON models(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_models_downloads ON models(downloads DESC);