import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import Account from '../models/userModel.js'
import { verifyToken } from '../middleware/checkAuth.js'
import { redirectOAuth } from '../strategies.js'


const router = Router()


const validEmail = (em) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)
const strongPass = (pw) => /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/.test(pw)
const tokenFor = (u) => jwt.sign({ uid: u._id, email: u.email, name: u.displayName }, process.env.JWT_KEY, { expiresIn: '7d' })


router.post('/register', async (req, res) => {
const { email, password, name } = req.body
if (!validEmail(email)) return res.status(400).json({ error: 'Invalid email' })
if (!strongPass(password)) return res.status(400).json({ error: 'Weak password' })


const exists = await Account.findOne({ email })
if (exists) return res.status(409).json({ error: 'Email already in use' })


const salt = await bcrypt.genSalt(10)
const hash = await bcrypt.hash(password, salt)
const user = await Account.create({ email, displayName: name || email.split('@')[0], passwordHash: hash })


res.status(201).json({ message: 'Registered', user: { id: user._id, email: user.email } })
})


router.post('/login', async (req, res) => {
const { email, password } = req.body
const user = await Account.findOne({ email })
if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' })


const ok = await bcrypt.compare(password, user.passwordHash)
if (!ok) return res.status(401).json({ error: 'Invalid credentials' })


res.json({ token: tokenFor(user), user: { id: user._id, email: user.email } })
})


router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }))
router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => redirectOAuth(res, req.user))
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }))
router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => redirectOAuth(res, req.user))


router.get('/me', verifyToken, async (req, res) => {
const user = await Account.findById(req.currentUser.uid).select('email displayName')
res.json({ user })
})


router.delete('/delete', async (req, res) => {
  const { email } = req.body;
  const result = await Account.deleteOne({ email });
  res.json(result);
});

export default router