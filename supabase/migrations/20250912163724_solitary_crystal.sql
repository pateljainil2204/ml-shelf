/*
  # Create models storage bucket

  1. Storage Setup
    - Create 'models' storage bucket for file uploads
    - Configure bucket to allow file uploads and downloads
  
  2. Security Policies
    - Allow authenticated users to upload files
    - Allow public read access for downloads
    - Users can only delete their own files
*/

-- Create the models storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('models', 'models', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload models"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'models');

-- Policy: Allow public read access to model files
CREATE POLICY "Public can view model files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'models');

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own model files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'models' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Policy: Users can update their own files
CREATE POLICY "Users can update own model files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'models' AND auth.uid()::text = (storage.foldername(name))[1]);