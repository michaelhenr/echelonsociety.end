import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Brands Backend Service
 * Handles brand registration and management with validation
 * 
 * Features:
 * - Email format validation
 * - Phone number validation
 * - Duplicate name checking
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
      console.error('[Brands] Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Use service role key to bypass RLS for public brand submissions
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // LIST ALL BRANDS
    if (req.method === 'GET' && action === 'list') {
      const { data, error } = await supabaseClient
        .from('brands')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      console.log(`[Brands] Listed ${data.length} brands`);
      return new Response(JSON.stringify({ brands: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET SINGLE BRAND
    if (req.method === 'GET' && action === 'get') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Brand ID is required');
      }

      const { data, error } = await supabaseClient
        .from('brands')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      console.log(`[Brands] Retrieved brand: ${data.name}`);
      return new Response(JSON.stringify({ brand: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // CREATE BRAND
    if (req.method === 'POST') {
      const { name, description, contact_email, contact_phone } = await req.json();

      // Validation
      if (!name) {
        throw new Error('Brand name is required');
      }

      if (!contact_email || !contact_phone) {
        throw new Error('Contact email and phone are required');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact_email)) {
        throw new Error('Invalid email format');
      }

      // Check for duplicate brand name
      const { data: existing, error: checkError } = await supabaseClient
        .from('brands')
        .select('id')
        .eq('name', name)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        throw new Error('A brand with this name already exists');
      }

      const { data, error } = await supabaseClient
        .from('brands')
        .insert({
          name,
          description,
          contact_email,
          contact_phone,
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`[Brands] Created new brand: ${data.name} (${data.id})`);
      return new Response(JSON.stringify({ brand: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // UPDATE BRAND
    if (req.method === 'PUT') {
      const { id, name, description, contact_email, contact_phone } = await req.json();

      if (!id) {
        throw new Error('Brand ID is required');
      }

      // Email validation if provided
      if (contact_email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact_email)) {
          throw new Error('Invalid email format');
        }
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (contact_email !== undefined) updateData.contact_email = contact_email;
      if (contact_phone !== undefined) updateData.contact_phone = contact_phone;

      const { data, error } = await supabaseClient
        .from('brands')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log(`[Brands] Updated brand: ${data.name} (${id})`);
      return new Response(JSON.stringify({ brand: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE BRAND
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Brand ID is required');
      }

      // Check if brand has products
      const { data: products, error: checkError } = await supabaseClient
        .from('products')
        .select('id')
        .eq('brand_id', id)
        .limit(1);

      if (checkError) throw checkError;

      if (products && products.length > 0) {
        throw new Error('Cannot delete brand with existing products. Delete products first.');
      }

      const { error } = await supabaseClient
        .from('brands')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`[Brands] Deleted brand: ${id}`);
      return new Response(JSON.stringify({ success: true, message: 'Brand deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request method or action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error: any) {
    console.error('[Brands] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
