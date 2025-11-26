import { supabase } from "@/integrations/supabase/client";

/**
 * Clients API Service
 * Handles client registration and tracking
 */

export class ClientsAPI {
  /**
   * Register client entry
   * @param name - Client name
   * @param email - Optional client email
   * @returns Client registration confirmation
   */
  static async register(name: string, email?: string) {
    if (!name) throw new Error('Client name is required');

    if (name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
    }

    try {
      const { data, error } = await supabase.functions.invoke('clients', {
        body: { name: name.trim(), email: email?.trim() || null },
        method: 'POST',
      });

      if (error) {
        console.error('[ClientsAPI] Error response:', error);
        throw new Error(`Failed to register client: ${error.message}`);
      }

      if (!data) {
        throw new Error('No response data from server');
      }

      console.log('[ClientsAPI] Client registered successfully:', data);
      return data;
    } catch (err: any) {
      console.error('[ClientsAPI] Registration failed:', err);
      throw err;
    }
  }

  /**
   * List all client entries (Admin only)
   * @returns Array of client entries
   */
  static async list() {
    const { data, error } = await supabase.functions.invoke('clients');

    if (error) throw new Error(`Failed to list clients: ${error.message}`);
    return data.clients;
  }
}
