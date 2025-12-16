import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image_url: { type: String, required: true }, // Mandatory
  category: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  brand_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export default mongoose.model('Product', productSchema)
