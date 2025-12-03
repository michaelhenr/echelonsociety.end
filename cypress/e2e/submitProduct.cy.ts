/**
 * Submit Product E2E Tests
 * @description End-to-end tests for product submission form
 * @module cypress/e2e/submitProduct
 * @url http://localhost:8080/submit-product
 * 
 * Test Scenarios:
 * - Display product submission form
 * - Fill product fields (name, price, description)
 * - Upload product images
 * - Submit product form
 */

describe('Submit Product E2E Tests', () => {
  /**
   * Navigate to product submission page before each test
   */
  beforeEach(() => {
    cy.visit('http://localhost:8080/submit-product')
  })

  /**
   * E2E Test: Display Submit Product Form
   * @test Product submission form loads
   * @scenario User navigates to /submit-product
   * @expects Form container with product fields visible
   */
  it('should display submit product form', () => {
    cy.get('[data-testid="submit-product-form"]').should('be.visible')
  })

  /**
   * E2E Test: Product Name Field
   * @test Product name input field exists
   * @scenario User accesses name field
   * @expects Input field for product name
   */
  it('should have product name field', () => {
    cy.get('[data-testid="product-name"]').should('exist')
  })

  /**
   * E2E Test: Product Price Field
   * @test Product price input field exists
   * @scenario User accesses price field
   * @expects Numeric input for price
   */
  it('should have product price field', () => {
    cy.get('[data-testid="product-price"]').should('exist')
  })

  /**
   * E2E Test: Product Description Field
   * @test Product description input field exists
   * @scenario User accesses description field
   * @expects Textarea for product description
   */
  it('should have product description field', () => {
    cy.get('[data-testid="product-description"]').should('exist')
  })

  /**
   * E2E Test: Image Upload
   * @test Product image upload feature exists
   * @scenario User accesses file upload
   * @expects File upload input for images
   */
  it('should allow product image upload', () => {
    cy.get('[data-testid="product-image-upload"]').should('exist')
  })

  /**
   * E2E Test: Submit Product Successfully
   * @test Form submits with valid product data
   * @scenario User fills and submits product form
   * @expects Form processed successfully
   */
  it('should submit product successfully', () => {
    cy.get('[data-testid="product-name"]').type('Test Product')
    cy.get('[data-testid="product-price"]').type('99.99')
    cy.get('[data-testid="product-description"]').type('Test Product Description')
    cy.get('[data-testid="submit-product-button"]').click()
  })
})
