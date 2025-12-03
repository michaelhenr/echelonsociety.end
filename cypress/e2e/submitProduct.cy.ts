describe('Submit Product E2E Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/submit-product')
  })

  it('should display submit product form', () => {
    cy.get('[data-testid="submit-product-form"]').should('be.visible')
  })

  it('should have product name field', () => {
    cy.get('[data-testid="product-name"]').should('exist')
  })

  it('should have product price field', () => {
    cy.get('[data-testid="product-price"]').should('exist')
  })

  it('should have product description field', () => {
    cy.get('[data-testid="product-description"]').should('exist')
  })

  it('should allow product image upload', () => {
    cy.get('[data-testid="product-image-upload"]').should('exist')
  })

  it('should submit product successfully', () => {
    cy.get('[data-testid="product-name"]').type('Test Product')
    cy.get('[data-testid="product-price"]').type('99.99')
    cy.get('[data-testid="product-description"]').type('Test Product Description')
    cy.get('[data-testid="submit-product-button"]').click()
  })
})
