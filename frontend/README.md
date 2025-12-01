# Frontend README

Location
- The frontend application lives in `frontend/src/` (moved from `src/`).

Run locally
```powershell
npm install
npm run dev
```

Testing
- Unit tests: `npm test` (Vitest)
- Generate per-page tests: `npm run test:generate`
- E2E tests: start `npm run dev` and run `npm run cy:open` for Cypress UI

Optional: If you want the frontend to call a local backend server (instead of supabase edge functions), set this environment variable in your `.env` file:

```
VITE_API_BASE_URL=http://localhost:4000
```

If this variable is set, the `ChatBot` will call `POST $VITE_API_BASE_URL/api/chat` instead of the Supabase function; other endpoints are available under `/api/*` (products, brands, ads, orders).

Example: Fetch products from the backend instead of Supabase

```ts
fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`)
	.then(res => res.json())
	.then(data => console.log(data))
```

Notes
- The frontend communicates with Supabase via `@/integrations/supabase/client`.
- A Supabase function `chat` is invoked by `frontend/src/components/ChatBot.tsx` using `supabase.functions.invoke('chat')`.
