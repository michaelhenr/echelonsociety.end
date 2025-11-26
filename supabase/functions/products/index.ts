import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Products Backend Service
 * Handles all product-related operations with custom business logic
 * 
 * Endpoints:
 * - GET ?action=list: List all products with brand information
 * - GET ?action=get&id=<uuid>: Get single product by ID
 * - POST (create): Create new product with validation
 * - PUT (update): Update existing product
 * - DELETE: Delete product by ID
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
      console.error('[Products] Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Use service role key to bypass RLS for public product submissions
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // LIST ALL PRODUCTS
    if (req.method === 'GET' && action === 'list') {
      const category = url.searchParams.get('category');
      const brandId = url.searchParams.get('brand_id');
      const inStock = url.searchParams.get('in_stock');

      let query = supabaseClient
        .from('products')
        .select('*, brands(id, name)')
        .order('created_at', { ascending: false });

      // Apply filters
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      if (brandId && brandId !== 'all') {
        query = query.eq('brand_id', brandId);
      }
      if (inStock === 'true') {
        query = query.eq('in_stock', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log(`[Products] Listed ${data.length} products`);
      return new Response(JSON.stringify({ products: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET SINGLE PRODUCT
    if (req.method === 'GET' && action === 'get') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Product ID is required');
      }

      const { data, error } = await supabaseClient
        .from('products')
        .select('*, brands(id, name)')
        .eq('id', id)
        .single();

      if (error) throw error;

      console.log(`[Products] Retrieved product: ${data.name}`);
      return new Response(JSON.stringify({ product: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // CREATE PRODUCT
    if (req.method === 'POST') {
      const { name, description, price, category, brand_id, image_url } = await req.json();

      // Validation
      if (!name || !price || !category || !brand_id) {
        throw new Error('Missing required fields: name, price, category, brand_id');
      }

      // Price validation - must be positive
      if (price <= 0) {
        throw new Error('Price must be a positive number');
      }

      // Verify brand exists
      const { data: brand, error: brandError } = await supabaseClient
        .from('brands')
        .select('id')
        .eq('id', brand_id)
        .single();

      if (brandError || !brand) {
        throw new Error('Invalid brand_id: Brand does not exist');
      }

      const { data, error } = await supabaseClient
        .from('products')
        .insert({
          name,
          description,
          price,
          category,
          brand_id,
          image_url,
          in_stock: true,
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`[Products] Created new product: ${data.name} (${data.id})`);
      return new Response(JSON.stringify({ product: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // UPDATE PRODUCT
    if (req.method === 'PUT') {
      const { id, name, description, price, category, brand_id, image_url, in_stock } = await req.json();

      if (!id) {
        throw new Error('Product ID is required');
      }

      // Price validation if provided
      if (price !== undefined && price <= 0) {
        throw new Error('Price must be a positive number');
      }

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      if (price !== undefined) updateData.price = price;
      if (category !== undefined) updateData.category = category;
      if (brand_id !== undefined) updateData.brand_id = brand_id;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (in_stock !== undefined) updateData.in_stock = in_stock;

      const { data, error } = await supabaseClient
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log(`[Products] Updated product: ${data.name} (${id})`);
      return new Response(JSON.stringify({ product: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE PRODUCT
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Product ID is required');
      }

      const { error } = await supabaseClient
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`[Products] Deleted product: ${id}`);
      return new Response(JSON.stringify({ success: true, message: 'Product deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request method or action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error: any) {
    console.error('[Products] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
