import { supabase } from "@/integrations/supabase/client";

/**
 * Centralized API Service Layer
 * All backend edge function calls are organized here
 * This provides a clean separation between frontend and backend
 */

// ============= PRODUCTS API =============

export const ProductsAPI = {
  /**
   * List all products with optional filters
   */
  async list(filters?: { category?: string; brand_id?: string; in_stock?: boolean }) {
    const params = new URLSearchParams();
    params.append('action', 'list');
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.brand_id) params.append('brand_id', filters.brand_id);
    if (filters?.in_stock !== undefined) params.append('in_stock', String(filters.in_stock));

    const { data, error } = await supabase.functions.invoke('products', {
      body: null,
      method: 'GET',
    });

    if (error) throw error;
    return data.products;
  },

  /**
   * Get single product by ID
   */
  async get(id: string) {
    const { data, error } = await supabase.functions.invoke('products', {
      body: { action: 'get', id },
    });

    if (error) throw error;
    return data.product;
  },

  /**
   * Create new product
   */
  async create(product: {
    name: string;
    description?: string;
    price: number;
    category: string;
    brand_id: string;
    image_url?: string;
  }) {
    const { data, error } = await supabase.functions.invoke('products', {
      body: product,
      method: 'POST',
    });

    if (error) throw error;
    return data.product;
  },

  /**
   * Update existing product
   */
  async update(id: string, updates: any) {
    const { data, error } = await supabase.functions.invoke('products', {
      body: { id, ...updates },
      method: 'PUT',
    });

    if (error) throw error;
    return data.product;
  },

  /**
   * Delete product
   */
  async delete(id: string) {
    const { data, error } = await supabase.functions.invoke('products', {
      body: { action: 'delete', id },
      method: 'DELETE',
    });

    if (error) throw error;
    return data;
  },
};

// ============= ORDERS API =============

export const OrdersAPI = {
  /**
   * Create new order with automatic shipping calculation
   */
  async create(orderData: {
    client_name: string;
    client_email: string;
    client_phone: string;
    client_address: string;
    client_city: string;
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
  }) {
    const { data, error } = await supabase.functions.invoke('orders', {
      body: { action: 'create', ...orderData },
      method: 'POST',
    });

    if (error) throw error;
    return data;
  },

  /**
   * List all orders with optional status filter
   */
  async list(status?: string) {
    const { data, error } = await supabase.functions.invoke('orders', {
      body: { action: 'list', status },
    });

    if (error) throw error;
    return data.orders;
  },

  /**
   * Get order details with items
   */
  async get(id: string) {
    const { data, error } = await supabase.functions.invoke('orders', {
      body: { action: 'get', id },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Update order status
   */
  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase.functions.invoke('orders', {
      body: { action: 'update_status', id, status },
      method: 'PUT',
    });

    if (error) throw error;
    return data.order;
  },
};

// ============= BRANDS API =============

export const BrandsAPI = {
  /**
   * List all brands
   */
  async list() {
    const { data, error } = await supabase.functions.invoke('brands', {
      body: { action: 'list' },
    });

    if (error) throw error;
    return data.brands;
  },

  /**
   * Get single brand
   */
  async get(id: string) {
    const { data, error } = await supabase.functions.invoke('brands', {
      body: { action: 'get', id },
    });

    if (error) throw error;
    return data.brand;
  },

  /**
   * Create new brand
   */
  async create(brand: {
    name: string;
    description?: string;
    contact_email: string;
    contact_phone: string;
  }) {
    const { data, error } = await supabase.functions.invoke('brands', {
      body: brand,
      method: 'POST',
    });

    if (error) throw error;
    return data.brand;
  },

  /**
   * Update brand
   */
  async update(id: string, updates: any) {
    const { data, error } = await supabase.functions.invoke('brands', {
      body: { id, ...updates },
      method: 'PUT',
    });

    if (error) throw error;
    return data.brand;
  },

  /**
   * Delete brand
   */
  async delete(id: string) {
    const { data, error } = await supabase.functions.invoke('brands', {
      body: { action: 'delete', id },
      method: 'DELETE',
    });

    if (error) throw error;
    return data;
  },
};

// ============= ADS API =============

export const AdsAPI = {
  /**
   * List all ads
   */
  async list(activeOnly = false) {
    const { data, error } = await supabase.functions.invoke('ads', {
      body: { action: 'list', active_only: activeOnly },
    });

    if (error) throw error;
    return data.ads;
  },

  /**
   * Create new ad
   */
  async create(ad: {
    title: string;
    description?: string;
    budget: number;
    image_url?: string;
    start_date?: string;
    end_date?: string;
  }) {
    const { data, error } = await supabase.functions.invoke('ads', {
      body: ad,
      method: 'POST',
    });

    if (error) throw error;
    return data.ad;
  },

  /**
   * Update ad
   */
  async update(id: string, updates: any) {
    const { data, error } = await supabase.functions.invoke('ads', {
      body: { id, ...updates },
      method: 'PUT',
    });

    if (error) throw error;
    return data.ad;
  },

  /**
   * Delete ad
   */
  async delete(id: string) {
    const { data, error } = await supabase.functions.invoke('ads', {
      body: { action: 'delete', id },
      method: 'DELETE',
    });

    if (error) throw error;
    return data;
  },
};

// ============= ANALYTICS API =============

export const AnalyticsAPI = {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const { data, error } = await supabase.functions.invoke('analytics');

    if (error) throw error;
    return data;
  },
};

// ============= NEWSLETTER API =============

export const NewsletterAPI = {
  /**
   * Subscribe to newsletter
   */
  async subscribe(email: string) {
    const { data, error } = await supabase.functions.invoke('newsletter', {
      body: { email },
      method: 'POST',
    });

    if (error) throw error;
    return data;
  },

  /**
   * List all subscribers (Admin only)
   */
  async list() {
    const { data, error } = await supabase.functions.invoke('newsletter');

    if (error) throw error;
    return data.subscribers;
  },
};

// ============= CLIENTS API =============

export const ClientsAPI = {
  /**
   * Register client entry
   */
  async register(name: string, email?: string) {
    const { data, error } = await supabase.functions.invoke('clients', {
      body: { name, email },
      method: 'POST',
    });

    if (error) throw error;
    return data;
  },

  /**
   * List all client entries (Admin only)
   */
  async list() {
    const { data, error } = await supabase.functions.invoke('clients');

    if (error) throw error;
    return data.clients;
  },
};

// ============= CHAT API (Existing) =============

export const ChatAPI = {
  /**
   * Send message to AI assistant
   */
  async sendMessage(message: string) {
    const { data, error } = await supabase.functions.invoke('chat', {
      body: { message },
    });

    if (error) throw error;
    return data.reply;
  },
};
