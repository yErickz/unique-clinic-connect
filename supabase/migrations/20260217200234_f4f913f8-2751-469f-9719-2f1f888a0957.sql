-- Create storage bucket for convenios logos
INSERT INTO storage.buckets (id, name, public) VALUES ('convenios', 'convenios', true);

-- Allow public read access
CREATE POLICY "Public read convenios logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'convenios');

-- Allow admins to upload
CREATE POLICY "Admins upload convenios logos"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'convenios' AND public.is_admin());

-- Allow admins to update
CREATE POLICY "Admins update convenios logos"
ON storage.objects FOR UPDATE
USING (bucket_id = 'convenios' AND public.is_admin());

-- Allow admins to delete
CREATE POLICY "Admins delete convenios logos"
ON storage.objects FOR DELETE
USING (bucket_id = 'convenios' AND public.is_admin());

-- Seed initial convenios_data in site_content if not exists
INSERT INTO public.site_content (key, value)
VALUES ('convenios_data', '[]')
ON CONFLICT (key) DO NOTHING;