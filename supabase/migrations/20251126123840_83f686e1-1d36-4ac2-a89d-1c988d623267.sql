-- Fix client_entries RLS to allow public access
-- This table needs to be publicly accessible since clients register before authentication

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Everyone can create client entries" ON public.client_entries;
DROP POLICY IF EXISTS "Admins can view client entries" ON public.client_entries;
DROP POLICY IF EXISTS "Anyone can insert client entries" ON public.client_entries;
DROP POLICY IF EXISTS "Everyone can view client entries" ON public.client_entries;

-- Disable RLS temporarily to allow public access
ALTER TABLE public.client_entries DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with proper public policies
ALTER TABLE public.client_entries ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their name (public feature)
CREATE POLICY "Public can create client entries"
ON public.client_entries
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow admins to view all entries
CREATE POLICY "Admins can view all client entries"
ON public.client_entries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);