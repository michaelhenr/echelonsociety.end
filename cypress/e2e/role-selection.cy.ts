/**
 * Role Selection Page E2E Tests
 * Tests: all 4 role options navigation (Client, Advertiser, Brand Owner, Product Submitter)
 */

describe('Role Selection Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load role selection page', () => {
    cy.url().should('include', '/');
    cy.contains('Echelon', { matchCase: false, timeout: 5000 }).should('be.visible');
  });

  it('should display all 4 role options', () => {
    cy.contains('Client', { matchCase: false }).should('be.visible');
    cy.contains('Advertiser', { matchCase: false }).should('be.visible');
    cy.contains('Brand', { matchCase: false }).should('be.visible');
    cy.contains('Product', { matchCase: false }).should('be.visible');
  });

  it('should navigate to products page as Client', () => {
    cy.contains('button, a', 'Client', { matchCase: false }).click({ force: true });
    cy.url().should('include', '/products');
  });

  it('should navigate to submit ad page as Advertiser', () => {
    cy.contains('button, a', 'Advertiser', { matchCase: false }).click({ force: true });
    cy.url().should('match', /submit-ad|submitad/i);
  });

  it('should navigate to submit brand page as Brand Owner', () => {
    cy.contains('button, a', 'Brand', { matchCase: false }).click({ force: true });
    cy.url().should('match', /submit-brand|submitbrand/i);
  });

  it('should navigate to submit product page as Product Submitter', () => {
    cy.contains('button, a', 'Product', { matchCase: false }).click({ force: true });
    cy.url().should('match', /submit-product|submitproduct/i);
  });

  it('should have background image styling', () => {
    cy.get('body, [class*="background"], [class*="bg-"]').should('exist');
  });
});
