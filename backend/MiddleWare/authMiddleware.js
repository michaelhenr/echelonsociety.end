import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config()

// NOTE: this is a simple example; in production validate JWT thoroughly,
// or use Supabase auth JWT validation.
export function checkAuth(req, res, next){
  const token = req.headers['authorization']?.split('Bearer ')?.[1]
  if(!token){
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try{
    // if you want to verify JWT via SUPABASE_JWT_SECRET (not configure here)
    const decoded = jwt.decode(token)
    req.user = decoded
    next()
  }catch(err){
    return res.status(401).json({ error: 'Invalid token' })
  }
}
