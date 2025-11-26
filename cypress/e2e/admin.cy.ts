/**
 * Admin Page E2E Tests
 * Tests: admin dashboard stats, view orders, edit products
 */

describe('Admin Page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('a, button').contains('Admin', { matchCase: false }).click({ force: true });
  });

  it('should load admin dashboard', () => {
    cy.url().should('include', '/admin');
    cy.contains('Dashboard', { matchCase: false, timeout: 5000 }).should('exist');
  });

  it('should display dashboard statistics', () => {
    cy.contains('Products', { matchCase: false }).should('be.visible');
    cy.contains('Orders', { matchCase: false }).should('be.visible');
    cy.contains('Brands', { matchCase: false }).should('be.visible');
    cy.contains('Ads', { matchCase: false }).should('be.visible');
  });

  it('should show orders list', () => {
    cy.get('[class*="table"]', { timeout: 5000 }).should('exist');
    cy.get('[class*="row"]').should('have.length.greaterThan', 0);
  });

  it('should display order details', () => {
    cy.get('[class*="row"]').first().within(() => {
      cy.get('button, a').click({ force: true });
    });
    cy.contains('Order ID', { matchCase: false, timeout: 5000 }).should('exist');
  });

  it('should display products management section', () => {
    cy.get('[role="tab"]').contains('Products', { matchCase: false }).click({ force: true });
    cy.get('[class*="table"]', { timeout: 5000 }).should('exist');
  });

  it('should allow editing product', () => {
    cy.get('[role="tab"]').contains('Products', { matchCase: false }).click({ force: true });
    cy.get('[class*="table"]').first().find('button').contains('Edit', { matchCase: false }).click({ force: true });
    cy.get('input', { timeout: 5000 }).should('be.visible');
  });

  it('should display brands management section', () => {
    cy.get('[role="tab"]').contains('Brands', { matchCase: false }).click({ force: true });
    cy.get('[class*="table"]', { timeout: 5000 }).should('exist');
  });

  it('should display ads management section', () => {
    cy.get('[role="tab"]').contains('Ads', { matchCase: false }).click({ force: true });
    cy.get('[class*="table"]', { timeout: 5000 }).should('exist');
  });

  it('should display client entries list', () => {
    cy.get('[role="tab"]').contains('Clients', { matchCase: false }).click({ force: true });
    cy.get('[class*="table"]', { timeout: 5000 }).should('exist');
  });
});
