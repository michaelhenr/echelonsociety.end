import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Clients Backend Service
 * Tracks client entries and activity on the platform
 * 
 * Features:
 * - Client entry registration
 * - Activity tracking
 * - Order history linking
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('[Clients] Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: { Authorization: req.headers.get('Authorization') || '' },
      },
    });

    // REGISTER CLIENT ENTRY
    if (req.method === 'POST') {
      const { name, email } = await req.json();

      // Validation
      if (!name) {
        throw new Error('Name is required');
      }

      // Trim and validate name
      const trimmedName = name.trim();
      if (trimmedName.length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      console.log(`[Clients] Attempting to register client: ${trimmedName}`);

      const { data, error } = await supabaseClient
        .from('client_entries')
        .insert({
          name: trimmedName,
          email: email || null,
        })
        .select()
        .single();

      if (error) {
        console.error('[Clients] Database error:', error);
        throw error;
      }

      console.log(`[Clients] New client entry: ${data.name} (${data.id})`);

      return new Response(JSON.stringify({
        success: true,
        message: `Welcome ${data.name}!`,
        client: data,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // LIST CLIENT ENTRIES (Admin only)
    if (req.method === 'GET') {
      const { data: clients, error: clientsError } = await supabaseClient
        .from('client_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      // For each client, get order count and newsletter status
      const enrichedClients = await Promise.all(
        clients.map(async (client) => {
          // Count orders by this client (matching by name)
          const { count: orderCount } = await supabaseClient
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('client_name', client.name);

          // Check newsletter subscription
          const { data: newsletter } = await supabaseClient
            .from('newsletter_subscribers')
            .select('email')
            .eq('email', client.email || '')
            .maybeSingle();

          return {
            ...client,
            order_count: orderCount || 0,
            subscribed_to_newsletter: !!newsletter,
          };
        })
      );

      console.log(`[Clients] Listed ${enrichedClients.length} client entries`);

      return new Response(JSON.stringify({ clients: enrichedClients }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error: any) {
    console.error('[Clients] Error:', error.message || error);
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

