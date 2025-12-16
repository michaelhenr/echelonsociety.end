import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  logo_url: String,
  website: String,
  contact_email: String,
  contact_phone: String,
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export default mongoose.model('Brand', brandSchema)

