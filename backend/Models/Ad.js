import mongoose from 'mongoose'

const adSchema = new mongoose.Schema({
  title: String,
  description: String,
  budget: Number,
  image_url: String,
  start_date: Date,
  end_date: Date,
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

export default mongoose.model('Ad', adSchema)
