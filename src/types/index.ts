/**
 * TypeScript type definitions for the Echelon Society platform
 */

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  brand_id: string;
  image_url?: string;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  brands?: {
    id: string;
    name: string;
  };
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
  contact_email: string;
  contact_phone: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string;
  client_city: string;
  shipping_cost: number;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  card_last_four?: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
  products?: {
    name: string;
    image_url?: string;
  };
}

export interface Ad {
  id: string;
  title: string;
  description?: string;
  budget: number;
  image_url?: string;
  start_date?: string;
  end_date?: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ClientEntry {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  order_count?: number;
  subscribed_to_newsletter?: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribed_at: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface DashboardStats {
  brands: number;
  products: number;
  orders: number;
  ads: number;
  clientEntries: number;
  total_revenue?: number;
}
