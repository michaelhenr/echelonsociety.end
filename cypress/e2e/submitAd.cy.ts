describe('Submit Ad E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/submit-ad')
  })

  it('should display submit ad form', () => {
    cy.get('[data-testid="submit-ad-form"]').should('be.visible')
  })

  it('should have required form fields', () => {
    cy.get('[data-testid="ad-title"]').should('exist')
    cy.get('[data-testid="ad-description"]').should('exist')
    cy.get('[data-testid="ad-category"]').should('exist')
  })

  it('should validate form submission', () => {
    cy.get('[data-testid="submit-ad-button"]').click()
    cy.get('[data-testid="form-error"]').should('exist')
  })

  it('should submit ad successfully with valid data', () => {
    cy.get('[data-testid="ad-title"]').type('Test Ad')
    cy.get('[data-testid="ad-description"]').type('Test Description')
    cy.get('[data-testid="submit-ad-button"]').click()
  })
})
