import { supabase } from "@/integrations/supabase/client";

/**
 * Analytics API Service
 * Handles dashboard statistics and analytics
 */

export interface DashboardStats {
  brands: number;
  products: number;
  orders: number;
  ads: number;
  clientEntries: number;
  total_revenue?: number;
}

export class AnalyticsAPI {
  /**
   * Get dashboard statistics
   * @returns Dashboard statistics including counts and revenue
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    const { data, error } = await supabase.functions.invoke('analytics');

    if (error) throw new Error(`Failed to get dashboard stats: ${error.message}`);
    return data;
  }
}
