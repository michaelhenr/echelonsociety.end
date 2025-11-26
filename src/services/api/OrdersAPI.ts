import { supabase } from "@/integrations/supabase/client";

/**
 * Orders API Service
 * Handles all order-related operations
 * 
 * Demonstrates: Business Logic, Factory Pattern
 */

export interface OrderItem {
  product_id: string;
  quantity: number;
  price: number;
}

export interface OrderInput {
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  client_city: string;
  payment_method?: string;
  card_last_four?: string | null;
  items: OrderItem[];
}

export class OrdersAPI {
  /**
   * Create new order with automatic shipping calculation
   * Shipping: Cairo & Alexandria = 70 EGP, Other cities = 100 EGP
   * 
   * @param orderData - Order information and items
   * @returns Created order with shipping cost and total
   */
  static async create(orderData: OrderInput) {
    // Validate required fields
    this.validateOrderData(orderData);

    const { data, error } = await supabase.functions.invoke('orders?action=create', {
      body: orderData,
      method: 'POST',
    });

    if (error) throw new Error(`Failed to create order: ${error.message}`);
    return data;
  }

  /**
   * List all orders with optional status filter
   * @param status - Optional status filter (pending, confirmed, shipped, delivered, cancelled)
   * @returns Array of orders
   */
  static async list(status?: string) {
    const params = new URLSearchParams();
    params.append('action', 'list');
    if (status) params.append('status', status);

    const { data, error } = await supabase.functions.invoke(`orders?${params.toString()}`, {
      method: 'GET',
    });

    if (error) throw new Error(`Failed to list orders: ${error.message}`);
    return data.orders;
  }

  /**
   * Get order details with items
   * @param id - Order UUID
   * @returns Order details including items
   */
  static async get(id: string) {
    if (!id) throw new Error('Order ID is required');

    const { data, error } = await supabase.functions.invoke(`orders?action=get&id=${id}`, {
      method: 'GET',
    });

    if (error) throw new Error(`Failed to get order: ${error.message}`);
    return data;
  }

  /**
   * Update order status
   * Valid transitions: pending → confirmed/cancelled, confirmed → shipped/cancelled, shipped → delivered
   * 
   * @param id - Order UUID
   * @param status - New status
   * @returns Updated order
   */
  static async updateStatus(id: string, status: string) {
    if (!id) throw new Error('Order ID is required');
    if (!status) throw new Error('Status is required');

    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const { data, error } = await supabase.functions.invoke('orders?action=update_status', {
      body: { id, status },
      method: 'PUT',
    });

    if (error) throw new Error(`Failed to update order status: ${error.message}`);
    return data.order;
  }

  /**
   * Validate order data
   * @private
   */
  private static validateOrderData(orderData: OrderInput): void {
    if (!orderData.client_name) throw new Error('Client name is required');
    if (!orderData.client_email) throw new Error('Client email is required');
    if (!orderData.client_phone) throw new Error('Client phone is required');
    if (!orderData.client_address) throw new Error('Client address is required');
    if (!orderData.client_city) throw new Error('Client city is required');

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(orderData.client_email)) {
      throw new Error('Invalid email format');
    }

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    orderData.items.forEach((item, index) => {
      if (!item.product_id) throw new Error(`Item ${index + 1}: product_id is required`);
      if (!item.quantity || item.quantity <= 0) throw new Error(`Item ${index + 1}: quantity must be positive`);
      if (!item.price || item.price <= 0) throw new Error(`Item ${index + 1}: price must be positive`);
    });
  }
}
