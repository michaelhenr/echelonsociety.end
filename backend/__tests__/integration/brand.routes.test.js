/**
 * Integration Tests: Brand API Routes
 * Tests API endpoints with real database interactions
 */

import { jest } from '@jest/globals'
import request from 'supertest'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import xssClean from 'xss-clean'
import Brand from '../../Models/Brand.js'
import brandRoutes from '../../Routes/brands.js'
import { setupTestDB, teardownTestDB, clearDatabase } from './setup.js'
import jwt from 'jsonwebtoken'

// Create test app
const app = express()
app.use(express.json())
app.use(cors())
app.use(helmet())
app.use(xssClean())
app.use('/brands', brandRoutes)

let adminToken = null

describe('Brand API Integration Tests', () => {
  beforeAll(async () => {
    await setupTestDB()
    adminToken = jwt.sign({ userID: 'admin123', role: 'admin' }, process.env.JWT_SECRET || 'test-secret')
  })

  afterAll(async () => {
    await teardownTestDB()
  })

  beforeEach(async () => {
    await clearDatabase()
  })

  describe('POST /brands', () => {
    it('should create a brand and save to database', async () => {
      // Don't clear before this test - we want to verify the brand was saved
      const brandData = {
        name: 'New Brand',
        description: 'Brand Description',
        contact_email: 'brand@example.com',
        contact_phone: '1234567890'
      }

      const response = await request(app)
        .post('/brands')
        .send(brandData)
        .expect(201)

      expect(response.body).toHaveProperty('_id')
      expect(response.body.name).toBe('New Brand')
      expect(response.body.status).toBe('pending')

      // Verify brand exists in database - query directly
      const brand = await Brand.findOne({ name: 'New Brand' })
      expect(brand).toBeTruthy()
      expect(brand.name).toBe('New Brand')
      expect(brand.status).toBe('pending')
      expect(brand._id.toString()).toBe(response.body._id.toString())
    })

    it('should set status to pending by default', async () => {
      const brandData = {
        name: 'Test Brand',
        description: 'Description',
        contact_email: 'test@example.com',
        contact_phone: '0987654321'
      }

      const response = await request(app)
        .post('/brands')
        .send(brandData)
        .expect(201)

      expect(response.body.status).toBe('pending')

      // Verify in database - query by name
      const brand = await Brand.findOne({ name: 'Test Brand' })
      expect(brand).toBeTruthy()
      expect(brand.status).toBe('pending')
    })
  })

  describe('GET /brands', () => {
    beforeEach(async () => {
      // Clear first, then create test brands
      await clearDatabase()
      // Create test brands with different statuses
      await Brand.create([
        {
          name: 'Accepted Brand',
          description: 'Desc',
          status: 'accepted',
          contact_email: 'accepted@example.com',
          contact_phone: '1111111111'
        },
        {
          name: 'Pending Brand',
          description: 'Desc',
          status: 'pending',
          contact_email: 'pending@example.com',
          contact_phone: '2222222222'
        }
      ])
    })

    it('should return all brands from database', async () => {
      const response = await request(app)
        .get('/brands')
        .expect(200)

      expect(Array.isArray(response.body)).toBe(true)
      // Should have exactly 2 brands (the ones we created in beforeEach)
      expect(response.body.length).toBe(2)
    })
  })

  describe('PATCH /brands/:id/accept', () => {
    let testBrand = null

    beforeEach(async () => {
      testBrand = await Brand.create({
        name: 'Brand to Accept',
        description: 'Description',
        status: 'pending',
        contact_email: 'test@example.com',
        contact_phone: '1234567890'
      })
    })

    it('should update brand status to accepted in database', async () => {
      const response = await request(app)
        .patch(`/brands/${testBrand._id}/accept`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(response.body.status).toBe('accepted')

      // Verify database was updated
      const mongoose = await import('mongoose')
      const brandId = mongoose.default.Types.ObjectId.isValid(testBrand._id) 
        ? testBrand._id 
        : new mongoose.default.Types.ObjectId(testBrand._id)
      const updatedBrand = await Brand.findById(brandId)
      expect(updatedBrand).toBeTruthy()
      expect(updatedBrand.status).toBe('accepted')
    })

    it('should return 404 if brand not found', async () => {
      const fakeId = '507f1f77bcf86cd799439011'
      const response = await request(app)
        .patch(`/brands/${fakeId}/accept`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('PATCH /brands/:id/reject', () => {
    let testBrand = null

    beforeEach(async () => {
      testBrand = await Brand.create({
        name: 'Brand to Reject',
        description: 'Description',
        status: 'pending',
        contact_email: 'test@example.com',
        contact_phone: '1234567890'
      })
    })

    it('should update brand status to rejected in database', async () => {
      const response = await request(app)
        .patch(`/brands/${testBrand._id}/reject`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200)

      expect(response.body.status).toBe('rejected')

      // Verify database was updated
      const mongoose = await import('mongoose')
      const brandId = mongoose.default.Types.ObjectId.isValid(testBrand._id) 
        ? testBrand._id 
        : new mongoose.default.Types.ObjectId(testBrand._id)
      const updatedBrand = await Brand.findById(brandId)
      expect(updatedBrand).toBeTruthy()
      expect(updatedBrand.status).toBe('rejected')
    })
  })
})

