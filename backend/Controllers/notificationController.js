import Notification from '../Models/Notification.js'

export async function listNotifications(req, res){
  try{
    const { page=1, limit=10 } = req.query
    const skip = (page - 1) * limit
    const data = await Notification.find().skip(skip).limit(Number(limit)).lean()
    res.json(data)
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to fetch notifications' })
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
