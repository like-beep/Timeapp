import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'timeapp-secret-key-2025'
const TOKEN_EXPIRY = '7d'

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
    return null
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash)
}

export function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: '未授权的请求' })
  }

  const decoded = verifyToken(token)
  if (!decoded) {
    return res.status(403).json({ error: '无效或过期的令牌' })
  }

  req.userId = decoded.userId
  next()
}
