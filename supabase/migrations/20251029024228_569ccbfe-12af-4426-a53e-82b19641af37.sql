-- Create client_entries table to track when clients enter the site
CREATE TABLE public.client_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Temporarily DISABLE Row Level Security to allow unauthenticated access
-- (Can be re-enabled later with proper policies if needed)
-- ALTER TABLE public.client_entries ENABLE ROW LEVEL SECURITY;

-- Create index for faster lookups
CREATE INDEX idx_client_entries_name ON public.client_entries(name);
CREATE INDEX idx_client_entries_email ON public.client_entries(email);