import { supabase } from '@/integrations/supabase/client'

const API_BASE = import.meta.env.VITE_API_BASE_URL

async function getJSON(path: string) {
  const res = await fetch(`${API_BASE}${path}`)
  if(!res.ok) throw new Error('Network error')
  return res.json()
}

export async function fetchProducts(){
  if(API_BASE) return getJSON('/product')
  const { data } = await supabase.from('products').select('*')
  return data
}

export async function fetchBrands(){
  if(API_BASE) return getJSON('/api/brands')
  const { data } = await supabase.from('brands').select('*')
  return data
}

export async function createProduct(body: any){
  if(API_BASE) return fetch(`${API_BASE}/product`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }, body: JSON.stringify(body)})
  return supabase.from('products').insert(body)
}

export async function createBrand(body: any){
  if(API_BASE) return fetch(`${API_BASE}/brands`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }, body: JSON.stringify(body)})
  return supabase.from('brands').insert(body)
}

export async function deleteProduct(id:string){
  if(API_BASE) return fetch(`${API_BASE}/product/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` } })
  return supabase.from('products').delete().eq('id', id)
}

export async function fetchOrders(){
  if(API_BASE) return getJSON('/cart')
  const { data } = await supabase.from('orders').select('*, order_items(*)')
  return data
}

export async function createOrder(body:any){
  if(API_BASE) return fetch(`${API_BASE}/cart`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)})
  return supabase.from('orders').insert(body)
}

export async function chatMessage(message: string){
  if(API_BASE){
    const res = await fetch(`${API_BASE}/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) })
    return res.json()
  }
  const { data } = await supabase.functions.invoke('chat', { body: { message } })
  return data
}

export default { fetchProducts, fetchBrands, createProduct, deleteProduct, fetchOrders, createOrder, createBrand, chatMessage }
