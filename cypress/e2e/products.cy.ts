/// <reference types="cypress" />

describe('Products page', () => {
  it('renders products list', () => {
    cy.visit('/products');
    cy.contains('Featured Collection');
    cy.get('img').should('have.length.greaterThan', 0);
  });
});
