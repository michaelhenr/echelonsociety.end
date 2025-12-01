import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1 },
  price: Number
})

const orderSchema = new mongoose.Schema({
  client_name: String,
  client_email: String,
  client_phone: String,
  client_address: String,
  client_city: String,
  shipping_cost: Number,
  total_amount: Number,
  items: [orderItemSchema],
  status: { type: String, default: 'pending' },
  created_at: { type: Date, default: Date.now }
})

export default mongoose.model('Order', orderSchema)
