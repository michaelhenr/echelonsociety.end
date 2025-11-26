import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Newsletter Backend Service
 * Handles newsletter subscriptions with discount code generation
 * 
 * Features:
 * - Email validation
 * - Duplicate subscription check
 * - 10% discount code generation
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('[Newsletter] Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Use service role key to bypass RLS for public newsletter subscriptions
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    // SUBSCRIBE TO NEWSLETTER
    if (req.method === 'POST') {
      const { email } = await req.json();

      // Validation
      if (!email) {
        throw new Error('Email is required');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format');
      }

      // Check for duplicate subscription
      const { data: existing, error: checkError } = await supabaseClient
        .from('newsletter_subscribers')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // Already subscribed, return discount code anyway
        console.log(`[Newsletter] Email already subscribed: ${email}`);
        return new Response(JSON.stringify({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          discount_code: 'ECHELON10',
          discount_percentage: 10,
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Subscribe new email
      const { data, error } = await supabaseClient
        .from('newsletter_subscribers')
        .insert({ email })
        .select()
        .single();

      if (error) throw error;

      // Generate 10% discount code
      const discountCode = 'ECHELON10';

      console.log(`[Newsletter] New subscription: ${email} - Discount code: ${discountCode}`);

      return new Response(JSON.stringify({
        success: true,
        message: 'Successfully subscribed! Check your email for the discount code.',
        discount_code: discountCode,
        discount_percentage: 10,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // LIST SUBSCRIBERS (Admin only)
    if (req.method === 'GET') {
      const { data, error } = await supabaseClient
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (error) throw error;

      console.log(`[Newsletter] Listed ${data.length} subscribers`);
      return new Response(JSON.stringify({ subscribers: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error: any) {
    console.error('[Newsletter] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
