-- Add user_id column (owner) and RLS policy for client_entries

-- Add owner column if missing
ALTER TABLE public.client_entries
  ADD COLUMN IF NOT EXISTS user_id uuid;

-- Optional: link to profiles table
ALTER TABLE public.client_entries
  ADD CONSTRAINT IF NOT EXISTS client_entries_user_id_fk FOREIGN KEY (user_id)
  REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE public.client_entries ENABLE ROW LEVEL SECURITY;

-- Re-create strict owner policies (adjust names to your conventions)
DROP POLICY IF EXISTS "Allow owner insert" ON public.client_entries;
DROP POLICY IF EXISTS "Allow owner select" ON public.client_entries;
DROP POLICY IF EXISTS "Allow owner update" ON public.client_entries;
DROP POLICY IF EXISTS "Allow owner delete" ON public.client_entries;

-- Allow owners to insert rows only when user_id equals auth.uid()
CREATE POLICY "Allow owner insert" ON public.client_entries
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow owners to select their rows
CREATE POLICY "Allow owner select" ON public.client_entries
  FOR SELECT
  USING (user_id = auth.uid());

-- Allow owners to update their rows
CREATE POLICY "Allow owner update" ON public.client_entries
  FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Allow owners to delete their rows
CREATE POLICY "Allow owner delete" ON public.client_entries
  FOR DELETE
  USING (user_id = auth.uid());
