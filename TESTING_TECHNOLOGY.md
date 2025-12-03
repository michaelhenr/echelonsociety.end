## Testing Technology Overview

This project uses a **multi-layered testing strategy** to cover both unit-level behavior and end-to-end user flows.

### 1. Unit & Component Testing (Vitest + React Testing Library)

- **Test runner**: `Vitest`
  - Configured in `vitest.config.ts` with:
    - **Environment**: `jsdom` so React components can render in a browser-like DOM.
    - **Globals**: enabled, so we can use `describe`, `it`, `expect` without importing them in every test.
    - **Setup file**: `vitest.setup.ts` to configure shared mocks and extensions.
- **React support**:
  - Uses the Vite plugin `@vitejs/plugin-react-swc` so the test environment matches the React build environment.
- **React Testing Library**:
  - Imported via `@testing-library/react` in tests such as `frontend/src/__tests__/Products.test.tsx`.
  - Used with helpers like `render` and `screen` to test from the **user’s perspective** (asserting on text, buttons, etc. instead of internal implementation details).
- **DOM matchers**:
  - `vitest.setup.ts` imports `@testing-library/jest-dom` to enable human-readable matchers like `toBeInTheDocument()`.
- **Mocking external services**:
  - `vitest.setup.ts` mocks the Supabase client (`@/integrations/supabase/client`) using `vi.mock`, so unit tests run **without real network/database calls**:
    - `supabase.from().select()` returns an empty dataset.
    - `supabase.auth.getUser()` returns a `null` user.
    - `supabase.functions.invoke()` is mocked to a predictable response.

**Example usage**:
- `frontend/src/__tests__/Products.test.tsx`:
  - Renders the `Products` page inside a `MemoryRouter`.
  - Asserts that the main heading `"Featured Collection"` appears, confirming that the route and component render correctly.

### 2. End-to-End Testing (Cypress)

- **Tool**: `Cypress` for **browser-level E2E tests**.
- **Configuration**:
  - Defined in `cypress.config.ts`.
  - `baseUrl: 'http://localhost:8080'` so tests can use `cy.visit('/products')` instead of full URLs.
  - `specPattern: 'cypress/e2e/**/*.cy.{js,ts}'` to automatically pick up all test specs under `cypress/e2e`.
  - `supportFile: 'cypress/support/e2e.ts'` for global Cypress configuration and custom commands.
- **What is covered**:
  - `cypress/e2e/home.cy.ts`:
    - Visits the home page (`/`).
    - Asserts that key hero content is visible: `"Echelon Society"`, `"A Higher Standard"`, and the `"Explore Our Collection"` button.
  - `cypress/e2e/products.cy.ts`:
    - Visits `/products`.
    - Checks that the `"Featured Collection"` text is visible.
    - Ensures there is at least one product image on the page, simulating a basic browse-products flow.

These tests verify that **routing, rendering, and main UI elements** work correctly in a real browser environment interacting with the running frontend (and optionally backend/Supabase).

### 3. How These Tools Work Together

- **Vitest + React Testing Library**:
  - Fast feedback on individual components and pages.
  - Ideal for testing **logic, conditional rendering, and small UI pieces** in isolation.
  - Uses mocks (e.g., Supabase) so tests are deterministic and not dependent on external services.
- **Cypress**:
  - Validates **full user flows**: navigation, page rendering, and DOM interactions in a real browser.
  - Ensures that the integrated system (frontend + backend/API or Supabase) behaves correctly from the user’s perspective.

In summary, the project combines **unit/component tests (Vitest + React Testing Library)** with **end-to-end tests (Cypress)** to ensure quality at both the micro (component) and macro (user journey) levels.



