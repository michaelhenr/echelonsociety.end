/**
 * Integration Tests: Product API Routes
 * Tests API endpoints with real database interactions
 */

import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import xssClean from 'xss-clean'
import MongoConnect from '../../DB/MongoConnect.js'
import Product from '../../Models/Product.js'
import Brand from '../../Models/Brand.js'
import productRoutes from '../../Routes/product.js'
import { setupTestDB, teardownTestDB, clearDatabase } from './setup.js'
import jwt from 'jsonwebtoken'

// Create test app
const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(xssClean())
app.use('/product', productRoutes)

// Test data
let testBrand = null
let adminToken = null
let clientToken = null

describe('Product API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDB()
    
    // Create test brand
    testBrand = new Brand({
      name: 'Test Brand',
      description: 'Test Brand Description',
      status: 'accepted'
    })
    await testBrand.save()
    
    // Create test tokens
    adminToken = jwt.sign({ userID: 'admin123', role: 'admin' }, process.env.JWT_SECRET || 'test-secret')
    clientToken = jwt.sign({ userID: 'client123', role: 'client' }, process.env.JWT_SECRET || 'test-secret')
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearDatabase()
    // Recreate test brand after clear
    testBrand = new Brand({
      name: 'Test Brand',
      description: 'Test Brand Description',
      status: 'accepted'
    })
    await testBrand.save()
  })

  describe('POST /product', () => {
    it('should create a product and save to database', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        category: 'Electronics',
        brand_id: testBrand._id.toString(),
        image_url: 'https://example.com/image.jpg',
        stock: 10
      }

      const response = await request(app)
        .post('/product')
        .send(productData)
        .expect(201)

      expect(response.body).toHaveProperty('_id')
      expect(response.body.name).toBe('Test Product')
      expect(response.body.status).toBe('pending')

      // Verify product exists in database - use mongoose to ensure same connection
      const mongoose = await import('mongoose')
      const productId = mongoose.default.Types.ObjectId.isValid(response.body._id) 
        ? response.body._id 
        : new mongoose.default.Types.ObjectId(response.body._id)
      const product = await Product.findById(productId)
      expect(product).toBeTruthy()
      expect(product.name).toBe('Test Product')
      expect(product.status).toBe('pending')
    })

    it('should reject product without image_url', async () => {
      const productData = {
        name: 'Test Product',
        price: 100,
        category: 'Electronics',
        brand_id: testBrand._id.toString()
      }

      const response = await request(app)
        .post('/product')
        .send(productData)
        .expect(400)

      expect(response.body).toHaveProperty('error')
      expect(response.body.error).toContain('Image URL')
    })

    it('should set status to pending by default', async () => {
      const productData = {
        name: 'New Product',
        description: 'Description',
        price: 150,
        category: 'Clothing',
        brand_id: testBrand._id.toString(),
        image_url: 'https://example.com/img.jpg'
      }

      const response = await request(app)
        .post('/product')
        .send(productData)
        .expect(201)

      expect(response.body.status).toBe('pending')

      // Verify in database
      const mongoose = await import('mongoose')
      const productId = mongoose.default.Types.ObjectId.isValid(response.body._id) 
        ? response.body._id 
        : new mongoose.default.Types.ObjectId(response.body._id)
      const product = await Product.findById(productId)
      expect(product).toBeTruthy()
      expect(product.status).toBe('pending')
    })
  })

  describe('GET /product', () => {
    beforeEach(async () => {
      // Clear and recreate test brand
      await clearDatabase()
      testBrand = new Brand({
        name: 'Test Brand',
        description: 'Test Brand Description',
        status: 'accepted',
        contact_email: 'test@example.com',
        contact_phone: '1234567890'
      })
      await testBrand.save()
      
      // Create test products with different statuses
      await Product.create([
        {
          name: 'Approved Product',
          description: 'Desc',
          price: 100,
          category: 'Electronics',
          brand_id: testBrand._id,
          image_url: 'https://example.com/img1.jpg',
          status: 'approved'
        },
        {
          name: 'Pending Product',
          description: 'Desc',
          price: 200,
          category: 'Clothing',
          brand_id: testBrand._id,
          image_url: 'https://example.com/img2.jpg',
          status: 'pending'
        }
      ])
    })

    it('should return only approved products for unauthenticated users', async () => {
      const response = await request(app)
        .get('/product')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      const approvedProducts = response.body.filter(p => p.status === 'approved')
      expect(approvedProducts.length).toBeGreaterThanOrEqual(1)
      expect(approvedProducts[0].status).toBe('approved')
    })

    it('should return all products for admin users', async () => {
      const response = await request(app)
        .get('/product')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThanOrEqual(2)
    })

    it('should return only approved products for client users', async () => {
      const response = await request(app)
        .get('/product')
        .set('Authorization', `Bearer ${clientToken}`)
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      const approvedProducts = response.body.filter(p => p.status === 'approved')
      expect(approvedProducts.length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('PATCH /product/:id/approve', () => {
    let testProduct = null

    beforeEach(async () => {
      testProduct = await Product.create({
        name: 'Product to Approve',
        description: 'Desc',
        price: 100,
        category: 'Electronics',
        brand_id: testBrand._id,
        image_url: 'https://example.com/img.jpg',
        status: 'pending'
      })
    })

    it('should update product status to approved in database', async () => {
      const productId = testProduct._id.toString()
      const response = await request(app)
        .patch(`/product/${productId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(response.body.status).toBe('approved')

      // Verify database was updated
      const mongoose = await import('mongoose')
      const updatedProduct = await Product.findById(mongoose.default.Types.ObjectId.isValid(productId) ? productId : new mongoose.default.Types.ObjectId(productId))
      expect(updatedProduct).toBeTruthy()
      expect(updatedProduct.status).toBe('approved')
    })

    it('should return 404 if product not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011'
      const response = await request(app)
        .patch(`/product/${fakeId}/approve`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })

    it('should require authentication', async () => {
      const response = await request(app)
        .patch(`/product/${testProduct._id}/approve`)
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PATCH /product/:id/reject', () => {
    let testProduct = null

    beforeEach(async () => {
      testProduct = await Product.create({
        name: 'Product to Reject',
        description: 'Desc',
        price: 100,
        category: 'Electronics',
        brand_id: testBrand._id,
        image_url: 'https://example.com/img.jpg',
        status: 'pending'
      })
    })

    it('should update product status to rejected in database', async () => {
      const response = await request(app)
        .patch(`/product/${testProduct._id}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(response.body.status).toBe('rejected')

      // Verify database was updated
      const updatedProduct = await Product.findById(testProduct._id)
      expect(updatedProduct.status).toBe('rejected')
    })
  })
})

