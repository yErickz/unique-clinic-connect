
-- Fix RLS policies: change to PERMISSIVE so public SELECT and admin ALL work independently

-- doctors
DROP POLICY "Public read doctors" ON public.doctors;
DROP POLICY "Admins manage doctors" ON public.doctors;
CREATE POLICY "Public read doctors" ON public.doctors FOR SELECT USING (true);
CREATE POLICY "Admins manage doctors" ON public.doctors FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- institutes
DROP POLICY "Public read institutes" ON public.institutes;
DROP POLICY "Admins manage institutes" ON public.institutes;
CREATE POLICY "Public read institutes" ON public.institutes FOR SELECT USING (true);
CREATE POLICY "Admins manage institutes" ON public.institutes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- testimonials
DROP POLICY "Public read published testimonials" ON public.testimonials;
DROP POLICY "Admins manage testimonials" ON public.testimonials;
CREATE POLICY "Public read published testimonials" ON public.testimonials FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins manage testimonials" ON public.testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- site_content
DROP POLICY "Public read site_content" ON public.site_content;
DROP POLICY "Admins manage site_content" ON public.site_content;
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Admins manage site_content" ON public.site_content FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- user_roles
DROP POLICY "Admins can view roles" ON public.user_roles;
DROP POLICY "Admins can insert roles" ON public.user_roles;
DROP POLICY "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can view roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.is_admin());
