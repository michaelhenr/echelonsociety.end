import User from '../Models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function createUser(req, res) {
  try {
    const { email, password, name } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const user = new User({ email, password: hashed, name })
    const saved = await user.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Unable to create user' })
  }
}

export async function loginUser(req, res) {
  try{
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if(!user) return res.status(401).json({ error: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if(!ok) return res.status(401).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ userID: user._id.toString(), role: user.role }, process.env.JWT_SECRET || 'fallback_secret')
    res.json({ token })
  }catch(err){
    console.error(err)
    res.status(500).json({ error: 'Unable to login' })
  }
}
