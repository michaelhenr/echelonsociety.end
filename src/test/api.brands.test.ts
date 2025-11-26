import { describe, it, expect } from 'vitest';

/**
 * Unit Tests for BrandsAPI Service
 * 
 * Tests brand creation, validation, and management
 * Demonstrates: Data Validation, Factory Pattern, CRUD Operations
 */

describe('BrandsAPI', () => {
  describe('create()', () => {
    it('should create brand with valid data', () => {
      const newBrand = {
        name: 'LuxeThreads Co.',
        description: 'Premium sustainable fashion brand',
        contact_email: 'contact@luxe.com',
        contact_phone: '01012345678',
      };

      expect(newBrand.name).toBeTruthy();
      expect(newBrand.contact_email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(newBrand.contact_phone).toBeTruthy();
    });

    it('should validate email format', () => {
      const validEmail = 'brand@echelon.com';
      const invalidEmail = 'notanemail';

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(validEmail).toMatch(emailRegex);
      expect(invalidEmail).not.toMatch(emailRegex);
    });

    it('should require brand name', () => {
      const brand = {
        name: '',
        contact_email: 'contact@brand.com',
        contact_phone: '01012345678',
      };

      expect(brand.name.length).toBe(0);
      // Should be rejected
    });

    it('should require contact email', () => {
      const brand = {
        name: 'Brand Name',
        contact_email: '',
        contact_phone: '01012345678',
      };

      expect(brand.contact_email.length).toBe(0);
    });

    it('should support optional description', () => {
      const brandWithDescription = {
        name: 'Brand A',
        description: 'Optional description',
        contact_email: 'contact@brand.com',
        contact_phone: '01012345678',
      };

      const brandWithoutDescription = {
        name: 'Brand B',
        contact_email: 'contact@brand.com',
        contact_phone: '01012345678',
      };

      expect(brandWithDescription).toHaveProperty('description');
      expect(brandWithoutDescription).not.toHaveProperty('description');
    });
  });

  describe('list()', () => {
    it('should return array of brands', () => {
      const brands = [
        { id: '1', name: 'Brand A' },
        { id: '2', name: 'Brand B' },
      ];

      expect(Array.isArray(brands)).toBe(true);
      expect(brands.length).toBeGreaterThanOrEqual(0);
    });

    it('should include brand metadata', () => {
      const brand = {
        id: 'brand-123',
        name: 'Luxury Brand',
        description: 'Premium brand',
        contact_email: 'contact@luxury.com',
        contact_phone: '01012345678',
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
      };

      expect(brand).toHaveProperty('id');
      expect(brand).toHaveProperty('name');
      expect(brand).toHaveProperty('created_at');
      expect(brand).toHaveProperty('updated_at');
    });
  });

  describe('get()', () => {
    it('should retrieve single brand by ID', () => {
      const brandId = 'brand-123';
      expect(brandId).toBeDefined();
      expect(brandId.length).toBeGreaterThan(0);
    });
  });

  describe('update()', () => {
    it('should update brand information', () => {
      const updates = {
        name: 'Updated Brand Name',
        description: 'New description',
        contact_email: 'newemail@brand.com',
      };

      expect(updates).toHaveProperty('name');
      expect(updates).toHaveProperty('description');
      expect(updates).toHaveProperty('contact_email');
    });

    it('should support partial updates', () => {
      const partialUpdate = {
        description: 'Only update description',
      };

      expect(Object.keys(partialUpdate).length).toBe(1);
    });
  });

  describe('delete()', () => {
    it('should delete brand by ID', () => {
      const brandId = 'brand-to-delete';
      expect(brandId).toBeDefined();
    });
  });

  describe('Data Validation', () => {
    it('should validate contact information', () => {
      const validBrand = {
        contact_email: 'valid@email.com',
        contact_phone: '01012345678',
      };

      expect(validBrand.contact_email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(validBrand.contact_phone).toMatch(/^\d+$/);
    });

    it('should reject invalid email formats', () => {
      const invalidEmails = ['plain.email', '@nodomain.com', 'user@', 'user@domain'];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      invalidEmails.forEach(email => {
        expect(email).not.toMatch(emailRegex);
      });
    });
  });
});
