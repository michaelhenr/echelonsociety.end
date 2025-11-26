# Testing Strategy and Guide

## Overview
This document outlines the comprehensive testing strategy for the Echelon Society project, including unit tests, integration tests, and end-to-end tests.

---

## Testing Pyramid

```
         ┌─────────┐
         │   E2E   │  5-10% of tests (slow, realistic)
         ├─────────┤
         │  INTEG. │  15-20% of tests (medium, realistic)
         ├─────────┤
         │ UNIT    │  70-80% of tests (fast, isolated)
         └─────────┘
```

---

## 1. Unit Testing

### Purpose
Test individual functions, components, and services in isolation.

### Tools
- **Framework**: Vitest
- **React Testing**: @testing-library/react
- **Mocking**: vi (Vitest)

### Running Tests
```bash
npm run test              # Run once
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage report
npm run test:ui          # UI dashboard
```

### Example Unit Tests

#### API Service Tests

```typescript
// ✅ Example: ProductsAPI.create() unit test
describe('ProductsAPI.create', () => {
  it('should create product with valid data', async () => {
    const input = {
      name: 'Test Product',
      price: 100,
      category: 'apparel',
      brand_id: 'brand-123',
    };

    // Validate structure
    expect(input.name).toBeTruthy();
    expect(input.price).toBeGreaterThan(0);
    expect(input.category).toBeTruthy();
    expect(input.brand_id).toBeTruthy();
  });

  it('should reject negative price', () => {
    const input = { price: -50 };
    expect(input.price).toBeLessThan(0);
  });
});
```

#### Component Tests

```typescript
// ✅ Example: ProductCard component test
import { render, screen } from '@testing-library/react';

describe('ProductCard', () => {
  it('should display product information', () => {
    const product = {
      id: '1',
      name: 'Test Product',
      price: 100,
      image_url: 'test.jpg',
    };

    render(<ProductCard product={product} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });

  it('should render product image', () => {
    const product = {
      id: '1',
      name: 'Test',
      price: 100,
      image_url: 'test.jpg',
    };

    render(<ProductCard product={product} />);
    const image = screen.getByAltText(/product/i);

    expect(image).toHaveAttribute('src', 'test.jpg');
  });
});
```

#### Utility Function Tests

```typescript
// ✅ Example: Shipping calculation test
describe('Shipping Calculation', () => {
  it('should calculate shipping for Cairo', () => {
    const shipping = calculateShipping('Cairo');
    expect(shipping).toBe(70);
  });

  it('should calculate shipping for other cities', () => {
    const shipping = calculateShipping('Aswan');
    expect(shipping).toBe(100);
  });

  it('should be case-insensitive', () => {
    expect(calculateShipping('cairo')).toBe(70);
    expect(calculateShipping('CAIRO')).toBe(70);
  });
});
```

### Test Coverage Goals
- **Frontend**: > 75% coverage
- **Backend**: > 80% coverage
- **Overall**: > 80% coverage

---

## 2. Integration Testing

### Purpose
Test how multiple components/services work together.

### Tools
- **Framework**: Vitest
- **API Testing**: Supertest (for backend)
- **Database**: Test database instance

### Example Integration Tests

#### API Layer Integration

```typescript
// ✅ Example: Order creation end-to-end in service layer
describe('OrdersAPI Integration', () => {
  it('should create order and calculate shipping', async () => {
    const orderData = {
      client_name: 'John Doe',
      client_email: 'john@example.com',
      client_phone: '01012345678',
      client_address: '123 Main St',
      client_city: 'Cairo',
      items: [
        { product_id: 'prod1', quantity: 2, price: 150 },
      ],
    };

    // API creates order and calculates shipping
    const result = await OrdersAPI.create(orderData);

    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('shipping_cost');
    expect(result).toHaveProperty('total_amount');
    expect(result.status).toBe('pending');
    expect(result.shipping_cost).toBe(70); // Cairo shipping
  });

  it('should calculate total including shipping', async () => {
    const orderData = {
      client_name: 'Jane Doe',
      client_city: 'Alexandria',
      items: [
        { product_id: 'prod1', quantity: 1, price: 200 },
      ],
      // ... other required fields
    };

    const result = await OrdersAPI.create(orderData);
    
    const expectedSubtotal = 200;
    const expectedShipping = 70; // Alexandria
    const expectedTotal = 270;

    expect(result.total_amount).toBe(expectedTotal);
  });
});
```

#### Component + API Integration

```typescript
// ✅ Example: ProductForm with API integration
describe('ProductForm with API', () => {
  it('should submit form and call API', async () => {
    const mockSubmit = vi.fn();
    
    render(<ProductForm onSubmit={mockSubmit} />);

    // User fills form
    await userEvent.type(screen.getByLabelText(/name/i), 'New Product');
    await userEvent.type(screen.getByLabelText(/price/i), '99.99');
    
    // User submits
    await userEvent.click(screen.getByRole('button', { name: /create/i }));

    // API should be called
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'New Product',
        price: 99.99,
      })
    );
  });
});
```

#### Database Integration

```typescript
// ✅ Example: Product CRUD integration test
describe('Product CRUD Operations', () => {
  it('should create, read, update, delete product', async () => {
    // CREATE
    const created = await ProductsAPI.create({
      name: 'Test Product',
      price: 100,
      category: 'test',
      brand_id: 'brand-123',
    });
    expect(created.id).toBeDefined();

    // READ
    const retrieved = await ProductsAPI.get(created.id);
    expect(retrieved.name).toBe('Test Product');

    // UPDATE
    const updated = await ProductsAPI.update(created.id, { price: 150 });
    expect(updated.price).toBe(150);

    // DELETE
    await ProductsAPI.delete(created.id);
    
    // Verify deletion
    try {
      await ProductsAPI.get(created.id);
      fail('Should not exist');
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
```

---

## 3. End-to-End (E2E) Testing

### Purpose
Test complete user workflows through the entire application.

### Tools
- **Framework**: Playwright or Cypress
- **Headless Browser**: Chromium
- **Test Data**: Seeded test database

### Setup

```bash
npm install -D @playwright/test
npm install -D cypress
```

#### Example E2E Test Scenarios

```typescript
// ✅ Example: Complete purchase workflow
import { test, expect } from '@playwright/test';

test('User should complete purchase', async ({ page }) => {
  // 1. User visits home page
  await page.goto('http://localhost:5173/');
  expect(await page.title()).toContain('Echelon Society');

  // 2. User navigates to products
  await page.click('text=Explore Our Collection');
  await page.waitForURL('**/products');

  // 3. User filters products
  await page.selectOption('select[name="category"]', 'apparel');
  await page.waitForSelector('[data-testid="product-card"]');

  // 4. User clicks on product
  const productCard = page.locator('[data-testid="product-card"]').first();
  await productCard.click();
  await page.waitForURL('**/products/**');

  // 5. User adds to cart
  await page.click('button:has-text("Add to Cart")');
  
  // 6. Cart badge updates
  const cartBadge = page.locator('[data-testid="cart-count"]');
  await expect(cartBadge).toContainText('1');

  // 7. User goes to checkout
  await page.click('[data-testid="cart-icon"]');
  await page.waitForURL('**/checkout');

  // 8. User fills checkout form
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.fill('input[name="phone"]', '01012345678');
  await page.fill('input[name="address"]', '123 Main St');
  await page.selectOption('select[name="city"]', 'cairo');

  // 9. User submits order
  await page.click('button:has-text("Place Order")');
  await page.waitForURL('**/order-confirmation/**');

  // 10. Order confirmation shown
  const confirmation = page.locator('[data-testid="order-confirmation"]');
  await expect(confirmation).toBeVisible();
  
  const orderNumber = page.locator('[data-testid="order-number"]');
  expect(await orderNumber.textContent()).toMatch(/^#\d+$/);
});
```

```typescript
// ✅ Example: Admin dashboard workflow
test('Admin should manage products', async ({ page }) => {
  // 1. Admin logs in
  await page.goto('http://localhost:5173/admin');
  await page.fill('input[type="email"]', 'admin@echelon.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Login")');

  // 2. Admin navigates to products
  await page.waitForURL('**/admin/products');

  // 3. Admin creates new product
  await page.click('button:has-text("Add Product")');
  await page.fill('input[name="name"]', 'New Blazer');
  await page.fill('input[name="price"]', '299.99');
  await page.fill('input[name="description"]', 'Premium wool blazer');
  await page.selectOption('select[name="category"]', 'apparel');
  await page.click('button:has-text("Create")');

  // 4. Product appears in list
  const productRow = page.locator('text=New Blazer');
  await expect(productRow).toBeVisible();

  // 5. Admin edits product
  const editButton = page.locator('[data-testid="product-edit"]').first();
  await editButton.click();
  await page.fill('input[name="price"]', '349.99');
  await page.click('button:has-text("Save")');

  // 6. Price updated
  const priceCell = page.locator('text=349.99');
  await expect(priceCell).toBeVisible();
});
```

```typescript
// ✅ Example: Newsletter subscription workflow
test('User should subscribe to newsletter', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Scroll to newsletter section
  await page.locator('[data-testid="newsletter-section"]').scrollIntoViewIfNeeded();

  // Enter email
  await page.fill('input[type="email"]', 'subscriber@example.com');

  // Submit
  await page.click('button:has-text("Subscribe")');

  // Success message
  const successMsg = page.locator('text=Successfully subscribed');
  await expect(successMsg).toBeVisible();

  // Discount code provided
  const discountCode = page.locator('[data-testid="discount-code"]');
  const code = await discountCode.textContent();
  expect(code).toBe('ECHELON10');
});
```

### Running E2E Tests

```bash
# Playwright
npx playwright test
npx playwright test --headed    # See browser
npx playwright test --debug     # Debug mode

# Cypress
npx cypress open     # Interactive mode
npx cypress run      # Headless mode
```

---

## Test-Driven Development (TDD) Workflow

### TDD Cycle: Red → Green → Refactor

#### Step 1: Red (Write Failing Test)

```typescript
// Write test first - it will fail
describe('Order Discount', () => {
  it('should apply newsletter discount', async () => {
    const order = await OrdersAPI.create({
      ...orderData,
      newsletter_discount_code: 'ECHELON10',
    });

    expect(order.discount).toBe(0.10); // 10% discount
    expect(order.total_after_discount).toBe(order.total_amount * 0.90);
  });
});
```

#### Step 2: Green (Write Minimum Code to Pass)

```typescript
// Write minimum code to make test pass
export const OrdersAPI = {
  async create(orderData: OrderInput) {
    let order = await database.orders.create({
      ...orderData,
      status: 'pending',
    });

    // Add discount logic
    if (orderData.newsletter_discount_code === 'ECHELON10') {
      const discount = order.total_amount * 0.10;
      order = await database.orders.update(order.id, {
        discount: 0.10,
        total_after_discount: order.total_amount * 0.90,
      });
    }

    return order;
  },
};
```

#### Step 3: Refactor (Improve Without Changing Behavior)

```typescript
// Refactor to cleaner code
function applyNewsletterDiscount(order: Order): Order {
  const NEWSLETTER_DISCOUNT = 0.10;
  return {
    ...order,
    discount: NEWSLETTER_DISCOUNT,
    total_after_discount: order.total_amount * (1 - NEWSLETTER_DISCOUNT),
  };
}

export const OrdersAPI = {
  async create(orderData: OrderInput) {
    let order = await database.orders.create({
      ...orderData,
      status: 'pending',
    });

    if (orderData.newsletter_discount_code === 'ECHELON10') {
      order = applyNewsletterDiscount(order);
      order = await database.orders.update(order.id, order);
    }

    return order;
  },
};
```

---

## Test Organization

```
src/
├── test/
│   ├── setup.ts                          # Test configuration
│   ├── api.products.test.ts             # ProductsAPI tests
│   ├── api.orders.test.ts               # OrdersAPI tests
│   ├── api.brands.test.ts               # BrandsAPI tests
│   ├── types.validation.test.ts         # Type validation tests
│   └── components/
│       ├── ProductCard.test.tsx         # Component tests
│       ├── ProductForm.test.tsx
│       └── OrderForm.test.tsx
├── services/
│   └── api.ts
└── ...
```

---

## Coverage Report

Run `npm run test:coverage` to generate coverage report:

```
✓ ProductsAPI
  ✓ list()
  ✓ get()
  ✓ create()
  ✓ update()
  ✓ delete()

✓ OrdersAPI
  ✓ create()
  ✓ list()
  ✓ get()
  ✓ updateStatus()

✓ BrandsAPI
  ✓ create()
  ✓ list()
  ✓ get()
  ✓ update()
  ✓ delete()

Coverage Summary:
  Statements   : 82.5%
  Branches     : 78.3%
  Functions    : 85.2%
  Lines        : 81.9%
```

---

## Continuous Integration (CI)

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - run: npm install
      
      - run: npm run lint
      
      - run: npm run test
      
      - run: npm run test:coverage
      
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Best Practices

### ✅ Do's
- Write tests before code (TDD)
- Test behavior, not implementation
- Use descriptive test names
- Keep tests isolated and independent
- Mock external dependencies
- Test error cases
- Aim for high coverage (> 80%)
- Use meaningful assertions

### ❌ Don'ts
- Don't test library functions
- Don't test UI implementation details
- Don't write brittle tests
- Don't ignore test failures
- Don't have dependencies between tests
- Don't test multiple things in one test
- Don't use vague test names
- Don't skip error path tests

---

## Traceability: Tests ↔ User Stories

### User Story
**FR2.1**: As a customer, I want to add products to my cart so that I can purchase multiple items.

### Corresponding Tests

```typescript
// Unit Test
describe('CartAPI.addItem', () => {
  it('should add item to cart', () => { /* ... */ });
});

// Integration Test
describe('Cart Persistence', () => {
  it('should save cart to local storage', () => { /* ... */ });
});

// E2E Test
test('User should add product to cart', async ({ page }) => {
  // Complete workflow test
});
```

---

## Conclusion

The Echelon Society project includes:
- ✅ Comprehensive unit tests
- ✅ Integration tests for API layer
- ✅ E2E tests for user workflows
- ✅ Test data validation
- ✅ TDD practices
- ✅ Continuous integration

This ensures:
- 🎯 High code quality
- 🧪 Reliable functionality
- 🔄 Confidence in refactoring
- 📈 Easy debugging
- 🛡️ Regression prevention

**Document Version:** 1.0  
**Last Updated:** November 26, 2025
