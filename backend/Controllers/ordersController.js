import { supabaseAdmin } from '../DB/supabaseClient.js'

export async function listOrders(req, res){
  try{
    const { data, error } = await supabaseAdmin.from('orders').select('*, order_items(*)')
    if(error) throw error
    res.json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch orders' })
  }
}

export async function createOrder(req, res){
  try{
    const { data, error } = await supabaseAdmin.from('orders').insert(req.body).select()
    if(error) throw error
    res.status(201).json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create order' })
  }
}
