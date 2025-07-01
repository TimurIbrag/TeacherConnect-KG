-- Ensure that guest users can view public photos  
DROP POLICY IF EXISTS "Public Access for Guest Users" ON storage.objects;
CREATE POLICY "Public Access for Guest Users" 
ON storage.objects 
FOR SELECT 
TO public
USING (bucket_id = 'avatars');

-- Also ensure that authenticated users can upload/update their own files
DROP POLICY IF EXISTS "Users can upload their own avatars" ON storage.objects;
CREATE POLICY "Users can upload their own avatars" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can update their own avatars" ON storage.objects;
CREATE POLICY "Users can update their own avatars" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Users can delete their own avatars" ON storage.objects;
CREATE POLICY "Users can delete their own avatars" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);