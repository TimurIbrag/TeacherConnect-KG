-- Check current storage policies
SELECT * FROM storage.policies WHERE bucket_id = 'avatars';

-- Ensure that guest users can view public photos
CREATE POLICY IF NOT EXISTS "Public Access for Guest Users" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

-- Also ensure that authenticated users can upload/update their own files
CREATE POLICY IF NOT EXISTS "Users can upload their own avatars" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can update their own avatars" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY IF NOT EXISTS "Users can delete their own avatars" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);