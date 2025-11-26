/**
 * Checkout Page E2E Tests
 * Tests: checkout flow, order creation, form validation
 */

describe('Checkout Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('a, button').contains('Products', { matchCase: false }).click({ force: true });
    // Add an item to cart first
    cy.get('[class*="card"]').first().find('button').contains('Add', { matchCase: false }).click({ force: true });
    cy.wait(500);
    cy.get('a, button').contains('Cart', { matchCase: false }).click({ force: true });
  });

  it('should load checkout page with cart items', () => {
    cy.url().should('include', '/checkout');
    cy.get('[class*="cart"]', { timeout: 5000 }).should('exist');
  });

  it('should display checkout form fields', () => {
    cy.get('input[type="text"], input[placeholder*="name"]').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="tel"]').should('exist');
  });

  it('should validate required fields', () => {
    cy.get('button').contains('Place Order', { matchCase: false }).click({ force: true });
    cy.contains('required', { matchCase: false }).should('be.visible');
  });

  it('should complete checkout successfully with valid data', () => {
    cy.get('input[placeholder*="name"]').first().type('John Doe', { delay: 50 });
    cy.get('input[type="email"]').type('john@example.com', { delay: 50 });
    cy.get('input[type="tel"]').type('1234567890', { delay: 50 });
    cy.get('input[placeholder*="address"]').type('123 Main St', { delay: 50 });
    cy.get('input[placeholder*="city"]').type('Cairo', { delay: 50 });
    cy.get('button').contains('Place Order', { matchCase: false }).click({ force: true });
    cy.contains('success', { matchCase: false, timeout: 5000 }).should('be.visible');
  });

  it('should display order total with shipping', () => {
    cy.get('[class*="total"]', { timeout: 5000 }).should('be.visible');
    cy.contains('Shipping', { matchCase: false }).should('be.visible');
  });

  it('should accept different cities with correct shipping', () => {
    cy.get('input[placeholder*="name"]').first().type('Jane Doe', { delay: 50 });
    cy.get('input[type="email"]').type('jane@example.com', { delay: 50 });
    cy.get('input[type="tel"]').type('9876543210', { delay: 50 });
    cy.get('input[placeholder*="address"]').type('456 Oak Ave', { delay: 50 });
    cy.get('input[placeholder*="city"]').type('Alexandria', { delay: 50 });
    cy.contains('70 EGP', { timeout: 5000 }).should('be.visible'); // Alexandria shipping rate
  });
});
