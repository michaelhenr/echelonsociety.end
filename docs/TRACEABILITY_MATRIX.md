# Traceability Matrix: User Stories → Patterns → Tests

This document maps a selection of key user stories to the design patterns used and the tests that exercise them.

## User Story 1 — Browse products
- As a customer, I want to browse and filter products so that I can find items I want to buy.
- Patterns: Facade (ProductsAPI), Strategy (list vs get), Observer (React state updates)
- Code locations: `src/services/api/ProductsAPI.ts`, `src/pages/Products.tsx`, `supabase/functions/products/index.ts`
- Tests: `src/test/api.products.test.ts` (Facade/unit tests for product listing), UI tests (pages/Products integration)

## User Story 2 — Create order
- As a customer, I want to place an order so that I can purchase selected items.
- Patterns: Factory (order creation), Repository (orders table abstraction), Facade (OrdersAPI)
- Code locations: `src/services/api/OrdersAPI.ts`, `supabase/functions/orders/index.ts`, `supabase/functions/_shared/business-logic.ts`
- Tests: `src/test/api.orders.test.ts` (order creation, totals, shipping calculations)

## User Story 3 — Subscribe to newsletter
- As a visitor, I want to subscribe to the newsletter to receive discounts.
- Patterns: Facade (NewsletterAPI), Decorator (error handling wrappers), Repository (newsletter_subscribers table)
- Code locations: `src/services/api/NewsletterAPI.ts`, `supabase/functions/newsletter/index.ts`, `supabase/functions/_shared/errors.ts`
- Tests: `src/test/*` (newsletter-related tests), unit tests for repository logic

## Notes
- This matrix is focused on high-value stories. For the course deliverable, include at least one FR and NFR per student and attach tests that trace to those user stories.
