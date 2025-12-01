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

Notes
- The frontend communicates with Supabase via `@/integrations/supabase/client`.
- A Supabase function `chat` is invoked by `frontend/src/components/ChatBot.tsx` using `supabase.functions.invoke('chat')`.
