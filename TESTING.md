# Testing Guide

Steps to run frontend tests locally (you must run `npm install` first to install dev dependencies):

1. Install dependencies:

```powershell
npm install
```

2. Run unit tests (Vitest):

```powershell
npm test
```

3. Run Cypress E2E tests (open GUI):

```powershell
npm run dev
npm run cy:open
```

4. Run Cypress E2E tests headless:

```powershell
npm run dev
npm run cy:run
```

Notes:
- We added a few sample tests, and a `vitest.config.ts` for unit tests. Additional tests are required for full coverage of all frontend files.
- If you'd like me to automatically add unit tests for every page and component, I can add tests incrementally, or update the repository to a monorepo structure.
