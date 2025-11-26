import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Analytics Backend Service
 * Provides dashboard statistics and insights for admin panel
 * 
 * Features:
 * - Entity counts (brands, products, orders, ads, clients)
 * - Revenue calculations
 * - Order status breakdown
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // GET DASHBOARD STATISTICS
    if (req.method === 'GET') {
      // Count brands
      const { count: brandsCount, error: brandsError } = await supabaseClient
        .from('brands')
        .select('*', { count: 'exact', head: true });

      if (brandsError) throw brandsError;

      // Count products
      const { count: productsCount, error: productsError } = await supabaseClient
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) throw productsError;

      // Count orders
      const { count: ordersCount, error: ordersError } = await supabaseClient
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (ordersError) throw ordersError;

      // Count ads
      const { count: adsCount, error: adsError } = await supabaseClient
        .from('ads')
        .select('*', { count: 'exact', head: true });

      if (adsError) throw adsError;

      // Count client entries
      const { count: clientsCount, error: clientsError } = await supabaseClient
        .from('client_entries')
        .select('*', { count: 'exact', head: true });

      if (clientsError) throw clientsError;

      // Calculate total revenue
      const { data: orders, error: revenueError } = await supabaseClient
        .from('orders')
        .select('total_amount');

      if (revenueError) throw revenueError;

      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0);

      // Order status breakdown
      const { data: orderStatuses, error: statusError } = await supabaseClient
        .from('orders')
        .select('status');

      if (statusError) throw statusError;

      const statusBreakdown = orderStatuses.reduce((acc: any, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {});

      // Recent activity - last 5 orders
      const { data: recentOrders, error: recentError } = await supabaseClient
        .from('orders')
        .select('id, client_name, total_amount, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentError) throw recentError;

      console.log('[Analytics] Generated dashboard statistics');

      return new Response(JSON.stringify({
        brands: brandsCount || 0,
        products: productsCount || 0,
        orders: ordersCount || 0,
        ads: adsCount || 0,
        clientEntries: clientsCount || 0,
        total_revenue: totalRevenue,
        order_status_breakdown: statusBreakdown,
        recent_orders: recentOrders,
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 405,
    });

  } catch (error: any) {
    console.error('[Analytics] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
