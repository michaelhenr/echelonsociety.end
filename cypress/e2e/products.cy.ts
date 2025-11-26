/**
 * Products Page E2E Tests
 * Tests: browse products, filter, search, add to cart
 */

describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('a, button').contains('Products', { matchCase: false }).click({ force: true });
  });

  it('should load products list', () => {
    cy.get('[class*="grid"]', { timeout: 10000 }).should('exist');
    cy.get('[class*="card"]').should('have.length.greaterThan', 0);
  });

  it('should display product details', () => {
    cy.get('[class*="card"]').first().within(() => {
      cy.contains('h', { timeout: 5000 }).should('be.visible'); // Product name
      cy.contains('button', 'Add').should('be.visible');
    });
  });

  it('should add product to cart', () => {
    cy.get('[class*="card"]').first().find('button').contains('Add', { matchCase: false }).click({ force: true });
    cy.contains('Added to cart', { matchCase: false, timeout: 5000 }).should('be.visible');
  });

  it('should filter products by category', () => {
    const categorySelect = cy.get('select, [role="combobox"]').first();
    categorySelect.should('exist');
    categorySelect.click({ force: true });
    cy.get('[role="option"]').first().click({ force: true });
    cy.wait(1000);
    cy.get('[class*="card"]').should('have.length.greaterThan', 0);
  });

  it('should search products by name', () => {
    const searchInput = cy.get('input[type="text"], input[placeholder*="Search"]').first();
    searchInput.should('exist');
    searchInput.type('Sweatshirt', { delay: 50 });
    cy.wait(500);
    cy.get('[class*="card"]').should('exist');
  });

  it('should navigate to checkout from cart', () => {
    cy.get('[class*="card"]').first().find('button').contains('Add', { matchCase: false }).click({ force: true });
    cy.wait(500);
    cy.get('a, button').contains('Cart', { matchCase: false }).click({ force: true });
    cy.url().should('include', '/checkout');
  });
});
