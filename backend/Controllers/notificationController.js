import Notification from '../Models/Notification.js'
import mongoose from 'mongoose'

export async function listNotifications(req, res){
  try{
    const { page=1, limit=50, unreadOnly } = req.query
    const skip = (page - 1) * limit
    const query = unreadOnly === 'true' ? { read: false } : {}
    const data = await Notification.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean()
    res.json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch notifications' })
  }
}

export async function getUnreadCount(req, res){
  try{
    const count = await Notification.countDocuments({ read: false })
    res.json({ count })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to get unread count' })
  }
}

export async function markAsRead(req, res){
  try{
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ error: 'Notification ID is required' })
    }
    if (id === 'all') {
      const result = await Notification.updateMany({}, { read: true })
      return res.json({ success: true, message: 'All notifications marked as read', count: result.modifiedCount })
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid Notification ID format' })
    }
    const notification = await Notification.findByIdAndUpdate(id, { read: true }, { new: true })
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' })
    }
    res.json(notification)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to mark notification as read' })
  }
}

export async function createNotification(req, res){
  try{
    const doc = new Notification(req.body)
    const saved = await doc.save()
    res.status(201).json(saved)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to create notification' })
  }
}
