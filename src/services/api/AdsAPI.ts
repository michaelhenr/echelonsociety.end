import { supabase } from "@/integrations/supabase/client";

/**
 * Ads API Service
 * Handles all advertisement-related operations
 */

export interface AdInput {
  title: string;
  description?: string;
  budget: number;
  image_url?: string;
  start_date?: string;
  end_date?: string;
}

export class AdsAPI {
  /**
   * List all ads with optional filtering
   * @param activeOnly - If true, only return active ads
   * @returns Array of ads
   */
  static async list(activeOnly = false) {
    const { data, error } = await supabase.functions.invoke('ads', {
      body: { action: 'list', active_only: activeOnly },
    });

    if (error) throw new Error(`Failed to list ads: ${error.message}`);
    return data.ads;
  }

  /**
   * Create new ad
   * @param ad - Ad data
   * @returns Created ad
   */
  static async create(ad: AdInput) {
    if (!ad.title) throw new Error('Ad title is required');
    if (!ad.budget || ad.budget <= 0) throw new Error('Ad budget must be positive');

    const { data, error } = await supabase.functions.invoke('ads', {
      body: ad,
      method: 'POST',
    });

    if (error) throw new Error(`Failed to create ad: ${error.message}`);
    return data.ad;
  }

  /**
   * Update existing ad
   * @param id - Ad UUID
   * @param updates - Partial ad updates
   * @returns Updated ad
   */
  static async update(id: string, updates: Partial<AdInput>) {
    if (!id) throw new Error('Ad ID is required');

    const { data, error } = await supabase.functions.invoke('ads', {
      body: { id, ...updates },
      method: 'PUT',
    });

    if (error) throw new Error(`Failed to update ad: ${error.message}`);
    return data.ad;
  }

  /**
   * Delete ad
   * @param id - Ad UUID
   */
  static async delete(id: string) {
    if (!id) throw new Error('Ad ID is required');

    const { data, error } = await supabase.functions.invoke('ads', {
      body: { action: 'delete', id },
      method: 'DELETE',
    });

    if (error) throw new Error(`Failed to delete ad: ${error.message}`);
    return data;
  }
}
