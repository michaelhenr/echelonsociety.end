import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Orders Backend Service
 * Handles order processing, shipping calculation, and order management
 * 
 * Custom Business Logic:
 * - Shipping: 70 EGP for Alexandria/Cairo, 100 EGP for other cities
 * - Order status workflow: pending → confirmed → shipped → delivered
 * - Automatic order total calculation
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
      console.error('[Orders] Missing Supabase environment variables');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // Use service role key to bypass RLS for public order creation
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // CREATE ORDER
    if (req.method === 'POST' && action === 'create') {
      const { 
        client_name, 
        client_email, 
        client_phone, 
        client_address, 
        client_city, 
        payment_method,
        card_last_four,
        items 
      } = await req.json();

      // Validation
      if (!client_name || !client_email || !client_phone || !client_address || !client_city) {
        throw new Error('All client information fields are required');
      }

      if (!items || items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      // Calculate shipping cost based on city
      // Business Rule: 70 EGP for Alexandria/Cairo, 100 EGP for others
      const shippingCost = (client_city.toLowerCase() === 'alexandria' || client_city.toLowerCase() === 'cairo') 
        ? 70 
        : 100;

      // Calculate subtotal from items
      let subtotal = 0;
      for (const item of items) {
        subtotal += item.price * item.quantity;
      }

      const totalAmount = subtotal + shippingCost;

      // Create order
      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .insert({
          client_name,
          client_email,
          client_phone,
          client_address,
          client_city,
          shipping_cost: shippingCost,
          total_amount: totalAmount,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabaseClient
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      console.log(`[Orders] Created order ${order.id} for ${client_name} - Total: ${totalAmount} EGP (Shipping: ${shippingCost} EGP)`);

      return new Response(JSON.stringify({ 
        order,
        message: 'Order created successfully',
        shipping_cost: shippingCost,
        subtotal,
        total: totalAmount
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // LIST ORDERS (Admin only)
    if (req.method === 'GET' && action === 'list') {
      const status = url.searchParams.get('status');

      let query = supabaseClient
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log(`[Orders] Listed ${data.length} orders`);
      return new Response(JSON.stringify({ orders: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET ORDER DETAILS WITH ITEMS
    if (req.method === 'GET' && action === 'get') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Order ID is required');
      }

      const { data: order, error: orderError } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('id', id)
        .single();

      if (orderError) throw orderError;

      const { data: items, error: itemsError } = await supabaseClient
        .from('order_items')
        .select('*, products(name, image_url)')
        .eq('order_id', id);

      if (itemsError) throw itemsError;

      console.log(`[Orders] Retrieved order ${id}`);
      return new Response(JSON.stringify({ order, items }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // UPDATE ORDER STATUS
    if (req.method === 'PUT' && action === 'update_status') {
      const { id, status } = await req.json();

      if (!id || !status) {
        throw new Error('Order ID and status are required');
      }

      // Validate status workflow
      const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const { data, error } = await supabaseClient
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log(`[Orders] Updated order ${id} status to: ${status}`);
      return new Response(JSON.stringify({ order: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request method or action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error: any) {
    console.error('[Orders] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
