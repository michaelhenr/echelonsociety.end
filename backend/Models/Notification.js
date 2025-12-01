import mongoose from 'mongoose'

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.model('Notification', notificationSchema)
