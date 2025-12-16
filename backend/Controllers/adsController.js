import Ad from '../Models/Ad.js'
import mongoose from 'mongoose'

export async function listAds(req, res){
  try{
    const ads = await Ad.find()
    res.json(ads)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch ads' })
  }
}

export async function createAd(req, res){
  try{
    const ad = new Ad(req.body)
    const savedAd = await ad.save()
    
    // Create notification for admin
    const { createNotification } = await import('../helpers/createNotification.js')
    await createNotification(
      'ad',
      'New Advertisement Submitted',
      `A new advertisement "${savedAd.title || 'Untitled'}" has been submitted with a budget of ${savedAd.budget || 0} EGP`
    )
    
    res.status(201).json(savedAd)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create ad' })
  }
}

export async function acceptAd(req, res){
  try{
    const { id } = req.params
    console.log('🔍 Accepting ad with ID:', id)
    if (!id) {
      return res.status(400).json({ error: 'Ad ID is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Ad ID format' })
    }
    const ad = await Ad.findByIdAndUpdate(
      id, 
      { status: 'accepted', updated_at: new Date() }, 
      { new: true }
    )
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' })
    }
    console.log('✅ Ad accepted:', ad._id, 'Status:', ad.status)
    res.json(ad)
  }catch(err){
    console.error('❌ Error accepting ad:', err)
    res.status(500).json({ error: 'Unable to accept ad' })
  }
}

export async function rejectAd(req, res){
  try{
    const { id } = req.params
    console.log('🔍 Rejecting ad with ID:', id)
    if (!id) {
      return res.status(400).json({ error: 'Ad ID is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Ad ID format' })
    }
    const ad = await Ad.findByIdAndUpdate(
      id, 
      { status: 'rejected', updated_at: new Date() }, 
      { new: true }
    )
    if (!ad) {
      return res.status(404).json({ error: 'Ad not found' })
    }
    console.log('✅ Ad rejected:', ad._id, 'Status:', ad.status)
    res.json(ad)
  }catch(err){
    console.error('❌ Error rejecting ad:', err)
    res.status(500).json({ error: 'Unable to reject ad' })
  }
}
