import Notification from '../Models/Notification.js'

export async function createNotification(type, title, message) {
  try {
    const notification = new Notification({
      type,
      title,
      message,
      read: false,
      active: true
    })
    await notification.save()
    console.log(`✅ Notification created: ${type} - ${title}`)
    return notification
  } catch (err) {
    console.error('❌ Error creating notification:', err)
    // Don't throw - notifications shouldn't break the main flow
    return null
  }
}

