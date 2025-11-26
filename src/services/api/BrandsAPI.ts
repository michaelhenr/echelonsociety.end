import { supabase } from "@/integrations/supabase/client";

/**
 * Brands API Service
 * Handles all brand-related operations
 * 
 * Demonstrates: Factory Pattern, Data Validation
 */

export interface BrandInput {
  name: string;
  description?: string;
  contact_email: string;
  contact_phone: string;
}

export class BrandsAPI {
  /**
   * List all brands
   * @returns Array of all brands
   */
  static async list() {
    const { data, error } = await supabase.functions.invoke('brands?action=list', {
      method: 'GET',
    });

    if (error) throw new Error(`Failed to list brands: ${error.message}`);
    return data.brands;
  }

  /**
   * Get single brand by ID
   * @param id - Brand UUID
   * @returns Brand details
   */
  static async get(id: string) {
    if (!id) throw new Error('Brand ID is required');

    const { data, error } = await supabase.functions.invoke(`brands?action=get&id=${id}`, {
      method: 'GET',
    });

    if (error) throw new Error(`Failed to get brand: ${error.message}`);
    return data.brand;
  }

  /**
   * Create new brand
   * @param brand - Brand data
   * @returns Created brand
   */
  static async create(brand: BrandInput) {
    this.validateBrandData(brand);

    const { data, error } = await supabase.functions.invoke('brands', {
      body: brand,
      method: 'POST',
    });

    if (error) throw new Error(`Failed to create brand: ${error.message}`);
    return data.brand;
  }

  /**
   * Update existing brand
   * @param id - Brand UUID
   * @param updates - Partial brand updates
   * @returns Updated brand
   */
  static async update(id: string, updates: Partial<BrandInput>) {
    if (!id) throw new Error('Brand ID is required');

    if (updates.contact_email) {
      this.validateEmail(updates.contact_email);
    }

    const { data, error } = await supabase.functions.invoke('brands', {
      body: { id, ...updates },
      method: 'PUT',
    });

    if (error) throw new Error(`Failed to update brand: ${error.message}`);
    return data.brand;
  }

  /**
   * Delete brand
   * @param id - Brand UUID
   */
  static async delete(id: string) {
    if (!id) throw new Error('Brand ID is required');

    const { data, error } = await supabase.functions.invoke(`brands?id=${id}`, {
      method: 'DELETE',
    });

    if (error) throw new Error(`Failed to delete brand: ${error.message}`);
    return data;
  }

  /**
   * Validate brand data
   * @private
   */
  private static validateBrandData(brand: BrandInput): void {
    if (!brand.name) throw new Error('Brand name is required');
    if (!brand.contact_email) throw new Error('Contact email is required');
    if (!brand.contact_phone) throw new Error('Contact phone is required');

    this.validateEmail(brand.contact_email);
  }

  /**
   * Validate email format
   * @private
   */
  private static validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  }
}
