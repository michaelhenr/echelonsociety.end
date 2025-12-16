# Testing Strategy for Echelon Society E-commerce Platform

## Project Context

**Project:** E-commerce Website (Echelon Society)  
**Tech Stack:** 
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Frontend: React, TypeScript, Vite
- Testing: Vitest (frontend), Jest/Mocha (backend), Cypress/Playwright (E2E)

---

## Testing Approach

### 1. Test-Driven Development (TDD) Strategy

**Process:**
1. Write test first (RED - test fails)
2. Write minimal code to pass (GREEN - test passes)
3. Refactor code (REFACTOR - improve while keeping tests green)

**Where to apply TDD:**
- New features (product approval, notification system)
- Bug fixes (write test that reproduces bug, then fix)
- Refactoring (ensure tests pass before and after)

**Evidence to collect:**
- Git commit history showing tests before implementation
- Test files with timestamps
- Documentation of TDD process

---

## Testing Layers

### Layer 1: Unit Tests (Foundation)

**Backend Unit Tests:**

```
backend/
├── __tests__/
│   ├── Controllers/
│   │   ├── productController.test.js
│   │   ├── ordersController.test.js
│   │   ├── brandsController.test.js
│   │   ├── adsController.test.js
│   │   └── notificationController.test.js
│   ├── Helpers/
│   │   ├── createNotification.test.js
│   │   └── seedProducts.test.js
│   └── Models/
│       ├── Product.test.js
│       ├── Order.test.js
│       ├── Brand.test.js
│       └── User.test.js
```

**What to test:**
- ✅ Controller functions with valid/invalid inputs
- ✅ Helper functions return correct values
- ✅ Model validations work correctly
- ✅ Error handling

**Example Test Cases:**
```javascript
// productController.test.js
describe('createProduct', () => {
  it('should create product with valid data', () => {...})
  it('should reject product without image_url', () => {...})
  it('should set status to pending by default', () => {...})
})

// createNotification.test.js
describe('createNotification', () => {
  it('should create notification with type and message', () => {...})
  it('should set read to false by default', () => {...})
})
```

**Frontend Unit Tests:**

```
frontend/src/
├── components/
│   ├── NotificationBell.test.tsx
│   ├── ProductCard.test.tsx
│   └── ProtectedRoute.test.tsx
├── pages/
│   ├── Admin.test.tsx
│   ├── Products.test.tsx
│   └── SignIn.test.tsx
└── lib/
    └── api.test.ts
```

**What to test:**
- ✅ Component rendering
- ✅ User interactions (clicks, form submissions)
- ✅ Props handling
- ✅ State management
- ✅ API function calls

**Example Test Cases:**
```typescript
// NotificationBell.test.tsx
describe('NotificationBell', () => {
  it('should render bell icon', () => {...})
  it('should show unread count badge', () => {...})
  it('should open popover on click', () => {...})
})

// api.test.ts
describe('fetchProducts', () => {
  it('should fetch products from API', () => {...})
  it('should handle API errors', () => {...})
})
```

---

### Layer 2: Integration Tests (Connections)

**API Integration Tests:**

```
backend/
└── __tests__/
    └── integration/
        ├── product.routes.test.js
        ├── order.routes.test.js
        ├── brand.routes.test.js
        └── auth.routes.test.js
```

**What to test:**
- ✅ API endpoints with real database
- ✅ Authentication middleware
- ✅ Database operations (create, read, update, delete)
- ✅ Data flow between layers

**Example Test Cases:**
```javascript
// product.routes.test.js
describe('POST /product', () => {
  it('should create product and save to database', async () => {
    const response = await request(app)
      .post('/product')
      .send({ name: 'Test Product', price: 100, ... })
    expect(response.status).toBe(201)
    const product = await Product.findOne({ name: 'Test Product' })
    expect(product).toBeTruthy()
  })
})

describe('PATCH /product/:id/approve', () => {
  it('should update product status to approved', async () => {
    const product = await createTestProduct()
    const response = await request(app)
      .patch(`/product/${product._id}/approve`)
      .set('Authorization', `Bearer ${adminToken}`)
    expect(response.body.status).toBe('approved')
  })
})
```

**Frontend-Backend Integration:**

```
tests/
└── integration/
    └── api-integration.test.ts
```

**What to test:**
- ✅ Frontend can communicate with backend
- ✅ Data flows correctly (fetch, create, update)
- ✅ Error handling across layers

---

### Layer 3: End-to-End Tests (Complete Flows)

**E2E Test Scenarios:**

```
tests/
└── e2e/
    ├── user-flow.spec.ts
    ├── admin-flow.spec.ts
    └── brand-product-flow.spec.ts
```

**Critical E2E Scenarios:**

1. **Complete User Purchase Flow:**
   ```
   - User signs up
   - User signs in
   - User browses products
   - User adds product to cart
   - User goes to checkout
   - User completes order
   - Order appears in admin dashboard
   ```

2. **Admin Product Approval Flow:**
   ```
   - Admin signs in
   - Client submits product
   - Admin sees notification
   - Admin views pending products
   - Admin approves product
   - Product appears in client view
   ```

3. **Brand Registration Flow:**
   ```
   - User registers brand
   - Admin receives notification
   - Admin approves brand
   - User can now use brand in product submission
   ```

**Tools for E2E:**
- **Cypress** (recommended - easy to use, good documentation)
- **Playwright** (alternative - faster, more features)

---

## Test Coverage Goals

### Coverage Targets:

| Component | Target Coverage |
|-----------|----------------|
| Backend Controllers | 80%+ |
| Backend Helpers | 90%+ |
| Frontend Components | 70%+ |
| API Routes | 75%+ |
| **Overall** | **70%+** |

### Critical Paths (Must have 100% coverage):
- ✅ User authentication (signup, login)
- ✅ Product creation and approval
- ✅ Order creation
- ✅ Brand registration and approval
- ✅ Notification system

---

## Test Data Management

### Test Fixtures:

```javascript
// tests/fixtures/products.js
export const testProduct = {
  name: 'Test Product',
  price: 100,
  category: 'Clothing',
  image_url: 'https://example.com/image.jpg',
  brand_id: 'test-brand-id'
}

// tests/fixtures/users.js
export const testAdmin = {
  email: 'test-admin@test.com',
  password: 'test123',
  role: 'admin'
}
```

### Test Database:
- Use separate test database (MongoDB test instance)
- Clean database before/after tests
- Use test data fixtures

---

## Running Tests

### Commands to Set Up:

```bash
# Backend tests
cd backend
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage

# Frontend tests
cd frontend
npm test                    # Run all tests
npm test -- --coverage     # Run with coverage

# E2E tests
npm run test:e2e           # Run E2E tests

# All tests
npm run test:all           # Run everything
```

---

## Test Traceability Matrix

### Linking Tests to User Stories:

| User Story | Test Type | Test File | Test Case |
|------------|-----------|-----------|-----------|
| As a client, I want to browse products | Unit | Products.test.tsx | Renders product list |
| As a client, I want to browse products | Integration | product.routes.test.js | GET /product returns products |
| As a client, I want to browse products | E2E | user-flow.spec.ts | User can view products |
| As an admin, I want to approve products | Unit | productController.test.js | approveProduct() works |
| As an admin, I want to approve products | Integration | product.routes.test.js | PATCH /product/:id/approve |
| As an admin, I want to approve products | E2E | admin-flow.spec.ts | Admin approves product |

---

## Implementation Plan

### Phase 1: Setup (Week 1)
- [ ] Install testing tools (Jest, Vitest, Cypress)
- [ ] Configure test environments
- [ ] Set up test database
- [ ] Create test fixtures

### Phase 2: Unit Tests (Week 2)
- [ ] Write backend unit tests (controllers, helpers)
- [ ] Write frontend unit tests (components, pages)
- [ ] Achieve 70%+ coverage

### Phase 3: Integration Tests (Week 2-3)
- [ ] Write API integration tests
- [ ] Test database operations
- [ ] Test authentication flows

### Phase 4: E2E Tests (Week 3)
- [ ] Set up Cypress/Playwright
- [ ] Write complete user flows
- [ ] Write admin workflows

### Phase 5: TDD Evidence (Ongoing)
- [ ] Document TDD process
- [ ] Show test-first commits
- [ ] Refactor with tests

### Phase 6: Documentation (Week 3)
- [ ] Generate coverage reports
- [ ] Create traceability matrix
- [ ] Document test strategy

---

## Success Criteria

✅ **Must Have:**
- Unit tests for critical functions
- Integration tests for API endpoints
- At least 1 complete E2E scenario
- 70%+ test coverage
- Tests traceable to user stories
- Can run all tests with single command

✅ **Nice to Have:**
- 80%+ test coverage
- Multiple E2E scenarios
- Visual regression tests
- Performance tests

---

## Next Steps

1. **Review this strategy** with your team
2. **Choose testing tools** (Jest vs Mocha, Cypress vs Playwright)
3. **Set up test environment** (test database, fixtures)
4. **Start with unit tests** (easiest to begin)
5. **Add integration tests** (test API endpoints)
6. **Implement E2E tests** (complete user flows)
7. **Generate reports** (coverage, traceability)

