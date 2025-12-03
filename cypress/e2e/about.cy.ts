describe('About Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/about')
  })

  it('should display about page', () => {
    cy.get('[data-testid="about-page"]').should('be.visible')
  })

  it('should display company information', () => {
    cy.get('[data-testid="company-info"]').should('exist')
  })

  it('should display team section', () => {
    cy.get('[data-testid="team-section"]').should('exist')
  })

  it('should display mission statement', () => {
    cy.get('[data-testid="mission-statement"]').should('exist')
  })
})
