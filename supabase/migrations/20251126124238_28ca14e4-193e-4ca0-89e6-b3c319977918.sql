-- Fix brands and products tables RLS to allow public submissions
-- Brand owners and product submitters should be able to submit without authentication

-- ============= BRANDS TABLE =============

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admins can manage brands" ON public.brands;

-- Create granular policies for brands
CREATE POLICY "Public can create brands"
ON public.brands
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update brands"
ON public.brands
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

CREATE POLICY "Admins can delete brands"
ON public.brands
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- ============= PRODUCTS TABLE =============

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- Create granular policies for products
CREATE POLICY "Public can create products"
ON public.products
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update products"
ON public.products
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

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

-- Note: "Brands are viewable by everyone" and "Products are viewable by everyone" policies already exist