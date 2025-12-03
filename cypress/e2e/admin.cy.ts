describe('Admin Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/admin')
  })

  it('should display admin dashboard', () => {
    cy.get('[data-testid="admin-dashboard"]').should('be.visible')
  })

  it('should display user management section', () => {
    cy.get('[data-testid="user-management"]').should('exist')
  })

  it('should display product management section', () => {
    cy.get('[data-testid="product-management"]').should('exist')
  })

  it('should display order management section', () => {
    cy.get('[data-testid="order-management"]').should('exist')
  })

  it('should allow filtering and searching', () => {
    cy.get('[data-testid="search-filter"]').should('exist')
  })
})
