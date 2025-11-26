import { supabase } from "@/integrations/supabase/client";

/**
 * Products API Service
 * Handles all product-related operations
 * 
 * Demonstrates: Facade Pattern, Service Layer Architecture
 */

export interface ProductFilters {
  category?: string;
  brand_id?: string;
  in_stock?: boolean;
}

export interface ProductInput {
  name: string;
  description?: string;
  price: number;
  category: string;
  brand_id: string;
  image_url?: string;
}

export class ProductsAPI {
  /**
   * List all products with optional filters
   * @param filters - Optional product filters
   * @returns Array of products
   */
  static async list(filters?: ProductFilters) {
    const params = new URLSearchParams();
    params.append('action', 'list');

    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand_id) params.append('brand_id', filters.brand_id);
    if (filters?.in_stock !== undefined) params.append('in_stock', String(filters.in_stock));

    const { data, error } = await supabase.functions.invoke(`products?${params.toString()}`, {
      method: 'GET',
    });

    if (error) throw new Error(`Failed to list products: ${error.message}`);
    return data.products;
  }

  /**
   * Get single product by ID
   * @param id - Product UUID
   * @returns Product details
   */
  static async get(id: string) {
    if (!id) throw new Error('Product ID is required');

    const { data, error } = await supabase.functions.invoke(`products?action=get&id=${id}`, {
      method: 'GET',
    });

    if (error) throw new Error(`Failed to get product: ${error.message}`);
    return data.product;
  }

  /**
   * Create new product
   * @param product - Product data
   * @returns Created product
   */
  static async create(product: ProductInput) {
    // Validation
    if (!product.name || !product.price || !product.category || !product.brand_id) {
      throw new Error('Missing required fields: name, price, category, brand_id');
    }

    if (product.price <= 0) {
      throw new Error('Price must be a positive number');
    }

    const { data, error } = await supabase.functions.invoke('products', {
      body: product,
      method: 'POST',
    });

    if (error) throw new Error(`Failed to create product: ${error.message}`);
    return data.product;
  }

  /**
   * Update existing product
   * @param id - Product UUID
   * @param updates - Partial product updates
   * @returns Updated product
   */
  static async update(id: string, updates: Partial<ProductInput>) {
    if (!id) throw new Error('Product ID is required');

    if (updates.price !== undefined && updates.price <= 0) {
      throw new Error('Price must be a positive number');
    }

    const { data, error } = await supabase.functions.invoke('products', {
      body: { id, ...updates },
      method: 'PUT',
    });

    if (error) throw new Error(`Failed to update product: ${error.message}`);
    return data.product;
  }

  /**
   * Delete product
   * @param id - Product UUID
   */
  static async delete(id: string) {
    if (!id) throw new Error('Product ID is required');

    const { data, error } = await supabase.functions.invoke(`products?id=${id}`, {
      method: 'DELETE',
    });

    if (error) throw new Error(`Failed to delete product: ${error.message}`);
    return data;
  }
}
