import { supabase } from "@/integrations/supabase/client";

/**
 * Newsletter API Service
 * Handles newsletter subscriptions and management
 */

export class NewsletterAPI {
  /**
   * Subscribe email to newsletter
   * Generates discount code: ECHELON10 (10% off)
   * 
   * @param email - Email address
   * @returns Subscription confirmation with discount code
   */
  static async subscribe(email: string) {
    if (!email) throw new Error('Email is required');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    const { data, error } = await supabase.functions.invoke('newsletter', {
      body: { email },
      method: 'POST',
    });

    if (error) throw new Error(`Failed to subscribe: ${error.message}`);
    return data;
  }

  /**
   * List all newsletter subscribers (Admin only)
   * @returns Array of subscribers
   */
  static async list() {
    const { data, error } = await supabase.functions.invoke('newsletter');

    if (error) throw new Error(`Failed to list subscribers: ${error.message}`);
    return data.subscribers;
  }
}
