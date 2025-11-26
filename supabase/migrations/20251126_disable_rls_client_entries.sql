-- Disable RLS on client_entries to allow unauthenticated inserts
ALTER TABLE public.client_entries DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can insert client entries" ON public.client_entries;
DROP POLICY IF EXISTS "Everyone can view client entries" ON public.client_entries;
DROP POLICY IF EXISTS "Everyone can create client entries" ON public.client_entries;
DROP POLICY IF EXISTS "Admins can view client entries" ON public.client_entries;
