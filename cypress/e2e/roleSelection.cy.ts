describe('Role Selection E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/role-selection')
  })

  it('should display role selection page', () => {
    cy.get('[data-testid="role-selection"]').should('be.visible')
  })

  it('should display available roles', () => {
    cy.get('[data-testid="role-option"]').should('have.length.greaterThan', 0)
  })

  it('should allow selecting a role', () => {
    cy.get('[data-testid="role-option"]').first().click()
    cy.get('[data-testid="confirm-role"]').should('be.visible')
  })

  it('should navigate after role selection', () => {
    cy.get('[data-testid="role-option"]').first().click()
    cy.get('[data-testid="confirm-role"]').click()
  })
})
