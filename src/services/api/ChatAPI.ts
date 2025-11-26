import { supabase } from "@/integrations/supabase/client";

/**
 * Chat API Service
 * Handles AI chatbot interactions
 */

export class ChatAPI {
  /**
   * Send message to AI assistant
   * @param message - User message
   * @returns AI response
   */
  static async sendMessage(message: string) {
    if (!message) throw new Error('Message is required');

    const { data, error } = await supabase.functions.invoke('chat', {
      body: { message },
    });

    if (error) throw new Error(`Failed to send message: ${error.message}`);
    return data.reply;
  }
}
