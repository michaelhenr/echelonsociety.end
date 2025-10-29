-- Create client_entries table to track when clients enter the site
CREATE TABLE public.client_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_entries ENABLE ROW LEVEL SECURITY;

-- Everyone can create client entries
CREATE POLICY "Everyone can create client entries"
ON public.client_entries
FOR INSERT
WITH CHECK (true);

-- Admins can view all client entries
CREATE POLICY "Admins can view client entries"
ON public.client_entries
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster lookups
CREATE INDEX idx_client_entries_name ON public.client_entries(name);
CREATE INDEX idx_client_entries_email ON public.client_entries(email);