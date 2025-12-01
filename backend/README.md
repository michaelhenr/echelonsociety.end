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

Local Express API (optional)
- `server.js` exposes these API endpoints when you run backend server:
  - GET `/api/products` - returns public products
  - POST `/api/products` - create a product (protected; requires Authorization header)
  - GET `/api/brands` - returns brand list
  - POST `/api/brands` - create a brand (protected)
  - GET `/api/ads` - returns ads
  - POST `/api/ads` - create an ad (protected)
  - GET `/api/orders` - returns orders (protected)
  - POST `/api/orders` - create an order (public)
  - POST `/api/chat` - proxied chat endpoint (uses `LOVABLE_API_KEY`)

Notes
- Use `backend/.env.example` to configure your env vars. To let the frontend call the local backend (instead of supabase functions), set `VITE_API_BASE_URL` in the frontend `.env` file (e.g., `VITE_API_BASE_URL=http://localhost:4000`).
