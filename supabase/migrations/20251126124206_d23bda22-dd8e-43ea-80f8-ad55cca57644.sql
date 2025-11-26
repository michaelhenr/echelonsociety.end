-- Fix ads table RLS to allow public ad submissions
-- Advertisers should be able to submit ads without authentication

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admins can manage ads" ON public.ads;

-- Create granular policies

-- 1. Allow anyone to submit (create) ads - public feature
CREATE POLICY "Public can create ads"
ON public.ads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 2. Allow admins to update ads
CREATE POLICY "Admins can update ads"
ON public.ads
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- 3. Allow admins to delete ads
CREATE POLICY "Admins can delete ads"
ON public.ads
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Note: "Ads are viewable by everyone" policy already exists for SELECT