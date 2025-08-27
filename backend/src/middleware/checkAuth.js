import jwt from 'jsonwebtoken'


export function verifyToken(req, res, next) {
const header = req.headers['authorization']
const token = header && header.split(' ')[1]
if (!token) return res.status(401).json({ error: 'Token missing' })


jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
if (err) return res.status(401).json({ error: 'Invalid token' })
req.currentUser = decoded
next()
})
}