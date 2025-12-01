import { supabaseAdmin } from '../DB/supabaseClient.js'

export async function listAds(req, res){
  try{
    const { data, error } = await supabaseAdmin.from('ads').select('*')
    if(error) throw error
    res.json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch ads' })
  }
}

export async function createAd(req, res){
  try{
    const { data, error } = await supabaseAdmin.from('ads').insert(req.body).select()
    if(error) throw error
    res.status(201).json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create ad' })
  }
}
