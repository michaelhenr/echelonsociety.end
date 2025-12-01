/// <reference types="cypress" />

describe('Home page', () => {
  it('renders hero content', () => {
    cy.visit('/');
    cy.contains('Echelon Society');
    cy.contains('A Higher Standard');
    cy.get('button').contains('Explore Our Collection');
  });
});
