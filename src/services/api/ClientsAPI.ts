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

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }
    }

    const { data, error } = await supabase.functions.invoke('clients', {
      body: { name, email },
      method: 'POST',
    });

    if (error) throw new Error(`Failed to register client: ${error.message}`);
    return data;
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
