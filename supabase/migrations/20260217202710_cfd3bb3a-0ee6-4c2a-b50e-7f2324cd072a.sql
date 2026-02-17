
-- Function to list admin users with their emails (requires service role internally)
CREATE OR REPLACE FUNCTION public.list_admin_users()
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  role_created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    au.id,
    au.email::text,
    au.created_at,
    ur.created_at AS role_created_at
  FROM public.user_roles ur
  JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at ASC;
$$;
