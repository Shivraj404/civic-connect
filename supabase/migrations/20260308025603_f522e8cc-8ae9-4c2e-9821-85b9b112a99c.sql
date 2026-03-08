
-- Allow authenticated users to upload images
CREATE POLICY "Auth users can upload to issue-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'issue-images');

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own issue images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'issue-images' AND (storage.foldername(name))[1] = auth.uid()::text);
