-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access
CREATE POLICY "Public read gallery images"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

-- Admin upload
CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery' AND public.is_admin());

-- Admin update
CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'gallery' AND public.is_admin());

-- Admin delete
CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
USING (bucket_id = 'gallery' AND public.is_admin());