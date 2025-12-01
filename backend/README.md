# Backend (server) README

Structure
- `backend/supabase/`: Contains Supabase functions (serverless) and database migrations.
  - `functions/`: Put Supabase edge function code here (e.g. `chat` function)
  - `migrations/`: SQL migration files to set up database schema and policies

Notes
- The frontend calls Supabase functions via the Supabase SDK: `supabase.functions.invoke('chat')`. The `chat` function implementation is available under `backend/supabase/functions/chat/index.ts` and is a copy of the top-level `supabase/functions/chat`.
- If you use the Supabase CLI locally, the CLI expects a top-level `supabase` folder. We intentionally kept a top-level `supabase/` as well, to avoid breaking Supabase CLI behavior. `backend/supabase` is the organized backend copy and the source of truth for backend code.
- If you'd like me to move `supabase` entirely under `backend/` and create a bridge for the CLI, I can do that next.

Deployment
- Use the Supabase CLI or the web dashboard to deploy functions and migrations from the `supabase/` (or `backend/supabase/`) folder.
