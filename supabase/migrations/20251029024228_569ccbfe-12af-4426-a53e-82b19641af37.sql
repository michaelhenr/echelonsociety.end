-- Create client_entries table to track when clients enter the site
CREATE TABLE public.client_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_entries ENABLE ROW LEVEL SECURITY;

-- Everyone (authenticated or not) can insert client entries
CREATE POLICY "Anyone can insert client entries"
ON public.client_entries
FOR INSERT
WITH CHECK (true);

-- Everyone can view all client entries
CREATE POLICY "Everyone can view client entries"
ON public.client_entries
FOR SELECT
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_client_entries_name ON public.client_entries(name);
CREATE INDEX idx_client_entries_email ON public.client_entries(email);