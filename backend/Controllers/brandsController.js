import Brand from '../Models/Brand.js'
import mongoose from 'mongoose'

export async function listBrands(req, res){
  try{
    const brands = await Brand.find()
    res.json(brands)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch brands' })
  }
}

export async function createBrand(req, res){
  try{
    const brand = new Brand(req.body)
    const savedBrand = await brand.save()
    
    // Create notification for admin
    const { createNotification } = await import('../helpers/createNotification.js')
    await createNotification(
      'brand',
      'New Brand Registration',
      `A new brand "${savedBrand.name}" has been registered and is pending approval`
    )
    
    res.status(201).json(savedBrand)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create brand' })
  }
}

export async function acceptBrand(req, res){
  try{
    const { id } = req.params
    console.log('🔍 Accepting brand with ID:', id)
    if (!id) {
      return res.status(400).json({ error: 'Brand ID is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Brand ID format' })
    }
    const brand = await Brand.findByIdAndUpdate(
      id, 
      { status: 'accepted', updated_at: new Date() }, 
      { new: true }
    )
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' })
    }
    console.log('✅ Brand accepted:', brand._id, 'Status:', brand.status)
    res.json(brand)
  }catch(err){
    console.error('❌ Error accepting brand:', err)
    res.status(500).json({ error: 'Unable to accept brand' })
  }
}

export async function rejectBrand(req, res){
  try{
    const { id } = req.params
    console.log('🔍 Rejecting brand with ID:', id)
    if (!id) {
      return res.status(400).json({ error: 'Brand ID is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Brand ID format' })
    }
    const brand = await Brand.findByIdAndUpdate(
      id, 
      { status: 'rejected', updated_at: new Date() }, 
      { new: true }
    )
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' })
    }
    console.log('✅ Brand rejected:', brand._id, 'Status:', brand.status)
    res.json(brand)
  }catch(err){
    console.error('❌ Error rejecting brand:', err)
    res.status(500).json({ error: 'Unable to reject brand' })
  }
}
