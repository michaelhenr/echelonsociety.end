import Order from '../Models/Order.js'
import mongoose from 'mongoose'

export async function listOrders(req, res){
  try{
    const orders = await Order.find().populate('items.product_id')
    res.json(orders)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch orders' })
  }
}

export async function createOrder(req, res){
  try{
    const order = new Order(req.body)
    const savedOrder = await order.save()
    
    // Create notification for admin
    const { createNotification } = await import('../helpers/createNotification.js')
    await createNotification(
      'order',
      'New Order Received',
      `A new order has been placed by ${savedOrder.client_name || 'a client'} for ${savedOrder.total_amount} EGP`
    )
    
    res.status(201).json(savedOrder)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create order' })
  }
}

export async function acceptOrder(req, res){
  try{
    const { id } = req.params
    console.log('🔍 Accepting order with ID:', id)
    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Order ID format' })
    }
    const order = await Order.findByIdAndUpdate(id, { status: 'accepted' }, { new: true })
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    console.log('✅ Order accepted:', order._id)
    res.json(order)
  }catch(err){
    console.error('❌ Error accepting order:', err)
    res.status(500).json({ error: 'Unable to accept order' })
  }
}

export async function rejectOrder(req, res){
  try{
    const { id } = req.params
    console.log('🔍 Rejecting order with ID:', id)
    if (!id) {
      return res.status(400).json({ error: 'Order ID is required' })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Order ID format' })
    }
    const order = await Order.findByIdAndUpdate(id, { status: 'rejected' }, { new: true })
    if (!order) {
      return res.status(404).json({ error: 'Order not found' })
    }
    console.log('✅ Order rejected:', order._id)
    res.json(order)
  }catch(err){
    console.error('❌ Error rejecting order:', err)
    res.status(500).json({ error: 'Unable to reject order' })
  }
}
