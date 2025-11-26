import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Ads Backend Service
 * Handles advertisement submissions and campaign management
 * 
 * Features:
 * - Budget validation
 * - Date range validation
 * - Active status management
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

    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // LIST ADS
    if (req.method === 'GET' && action === 'list') {
      const activeOnly = url.searchParams.get('active_only') === 'true';

      let query = supabaseClient
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (activeOnly) {
        query = query.eq('active', true);
      }

      const { data, error } = await query;

      if (error) throw error;

      console.log(`[Ads] Listed ${data.length} ads`);
      return new Response(JSON.stringify({ ads: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // GET SINGLE AD
    if (req.method === 'GET' && action === 'get') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Ad ID is required');
      }

      const { data, error } = await supabaseClient
        .from('ads')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      console.log(`[Ads] Retrieved ad: ${data.title}`);
      return new Response(JSON.stringify({ ad: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // CREATE AD
    if (req.method === 'POST') {
      const { title, description, budget, image_url, start_date, end_date } = await req.json();

      // Validation
      if (!title || !budget) {
        throw new Error('Title and budget are required');
      }

      // Budget validation - must be positive
      if (budget <= 0) {
        throw new Error('Budget must be a positive number');
      }

      // Date validation
      if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }

      const { data, error } = await supabaseClient
        .from('ads')
        .insert({
          title,
          description,
          budget,
          image_url,
          start_date,
          end_date,
          active: true,
        })
        .select()
        .single();

      if (error) throw error;

      console.log(`[Ads] Created new ad: ${data.title} (Budget: ${data.budget} EGP)`);
      return new Response(JSON.stringify({ ad: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 201,
      });
    }

    // UPDATE AD
    if (req.method === 'PUT') {
      const { id, title, description, budget, image_url, start_date, end_date, active } = await req.json();

      if (!id) {
        throw new Error('Ad ID is required');
      }

      // Budget validation if provided
      if (budget !== undefined && budget <= 0) {
        throw new Error('Budget must be a positive number');
      }

      // Date validation if both dates provided
      if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        if (endDate <= startDate) {
          throw new Error('End date must be after start date');
        }
      }

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (budget !== undefined) updateData.budget = budget;
      if (image_url !== undefined) updateData.image_url = image_url;
      if (start_date !== undefined) updateData.start_date = start_date;
      if (end_date !== undefined) updateData.end_date = end_date;
      if (active !== undefined) updateData.active = active;

      const { data, error } = await supabaseClient
        .from('ads')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      console.log(`[Ads] Updated ad: ${data.title} (${id})`);
      return new Response(JSON.stringify({ ad: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE AD
    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) {
        throw new Error('Ad ID is required');
      }

      const { error } = await supabaseClient
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      console.log(`[Ads] Deleted ad: ${id}`);
      return new Response(JSON.stringify({ success: true, message: 'Ad deleted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid request method or action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });

  } catch (error: any) {
    console.error('[Ads] Error:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
