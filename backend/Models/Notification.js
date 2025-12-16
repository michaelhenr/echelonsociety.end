import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: { type: String, enum: ['order', 'ad', 'brand', 'product'], required: true },
  read: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.model('Notification', notificationSchema)
