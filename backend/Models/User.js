import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  password: String, // hashed
  role: { type: String, enum: ['admin', 'client'], default: 'client' },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)
