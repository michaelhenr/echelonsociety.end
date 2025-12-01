import { supabaseAdmin } from '../DB/supabaseClient.js'

export async function listBrands(req, res){
  try{
    const { data, error } = await supabaseAdmin.from('brands').select('*')
    if(error) throw error
    res.json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch brands' })
  }
}

export async function createBrand(req, res){
  try{
    const { data, error } = await supabaseAdmin.from('brands').insert(req.body).select()
    if(error) throw error
    res.status(201).json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create brand' })
  }
}
