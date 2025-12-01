import { supabase } from './supabaseClient'; // adjust import to your existing client

export async function registerClient({ name, ...otherFields }) {
  // Using supabase-js v2:
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const user = session?.user;
  if (!user) throw new Error('Not authenticated');

  const insertPayload = {
    name,
    user_id: user.id,
    ...otherFields
  };

  const { data, error } = await supabase
    .from('client_entries')
    .insert([insertPayload]);

  if (error) {
    // preserve original error code/message
    throw new Error(`Failed to register client: ${error.message}`);
  }
  return data;
}