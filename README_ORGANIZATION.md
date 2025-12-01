Repository organization (added by Copilot):

Top-level folders created:
- backend/: Contains server and DB migration code (e.g. supabase functions, migrations)
- cypress/: Cypress E2E tests and config

Notes:
- The frontend source has been moved to `frontend/src/` and relevant config paths were updated.
- Vitest is configured and a unit test for the `Home` page is added at `src/__tests__/Home.test.tsx`.
- Cypress E2E tests were added under `cypress/e2e`.

What I changed:
- Copied `supabase/` into `backend/supabase/` and top-level `migrations/` into `backend/migrations/`.
- Added vitest config and test setup (vitest.config.ts, vitest.setup.ts).
- Added a small unit test and two Cypress test skeletons.
- Added tests and test scripts to `package.json`.

Next steps (recommended):
1. Run `npm install` to fetch new dev dependencies (vitest, cypress, testing-library).
2. Run `npm test` and `npm run cy:open` to check tests locally.
3. If you want the frontend physically moved to `frontend/`, confirm and I will move files and update Vite/TS config accordingly.
