import { supabaseAdmin } from '../DB/supabaseClient.js'

export async function getProducts(){
  const { data, error } = await supabaseAdmin.from('products').select('*')
  if(error) throw error
  return data
}

export async function createProduct(product){
  const { data, error } = await supabaseAdmin.from('products').insert(product).select()
  if(error) throw error
  return data
}

export async function deleteProduct(id){
  const { data, error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if(error) throw error
  return data
}
