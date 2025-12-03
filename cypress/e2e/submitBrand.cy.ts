describe('Submit Brand E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/submit-brand')
  })

  it('should display submit brand form', () => {
    cy.get('[data-testid="submit-brand-form"]').should('be.visible')
  })

  it('should have brand name field', () => {
    cy.get('[data-testid="brand-name"]').should('exist')
  })

  it('should have brand description field', () => {
    cy.get('[data-testid="brand-description"]').should('exist')
  })

  it('should allow brand logo upload', () => {
    cy.get('[data-testid="brand-logo-upload"]').should('exist')
  })

  it('should submit brand successfully', () => {
    cy.get('[data-testid="brand-name"]').type('Test Brand')
    cy.get('[data-testid="brand-description"]').type('Brand Description')
    cy.get('[data-testid="submit-brand-button"]').click()
  })
})
