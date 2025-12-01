import Ad from '../Models/Ad.js'

export async function listAds(req, res){
  try{
    const ads = await Ad.find().lean()
    res.json(ads)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch ads' })
  }
}

export async function createAd(req, res){
  try{
    const ad = new Ad(req.body)
    const saved = await ad.save()
    res.status(201).json(saved)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create ad' })
  }
}
