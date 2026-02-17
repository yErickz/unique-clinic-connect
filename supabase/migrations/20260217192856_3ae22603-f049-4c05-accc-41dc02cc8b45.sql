
-- Junction table for many-to-many doctors <-> institutes
CREATE TABLE public.doctor_institutes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  institute_id UUID NOT NULL REFERENCES public.institutes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(doctor_id, institute_id)
);

-- Enable RLS
ALTER TABLE public.doctor_institutes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read doctor_institutes"
  ON public.doctor_institutes FOR SELECT USING (true);

CREATE POLICY "Admins manage doctor_institutes"
  ON public.doctor_institutes FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Migrate existing data from doctors.institute_id
INSERT INTO public.doctor_institutes (doctor_id, institute_id)
SELECT id, institute_id FROM public.doctors WHERE institute_id IS NOT NULL;
