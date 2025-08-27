import 'dotenv/config';
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import passport from 'passport'
import morgan from 'morgan'
import authRoutes from './routes/authRoutes.js'
import './strategies.js'


dotenv.config()
const app = express()


app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())
app.use(morgan('tiny'))
app.use(passport.initialize())


app.get('/', (req, res) => {
console.log('root hit')
res.json({ msg: 'API running' })
})


app.use('/api/auth', authRoutes)


mongoose
.connect(process.env.MONGO_URL)
.then(() => {
console.log('Mongo connected')
app.listen(process.env.PORT, () => console.log('Server on', process.env.PORT))
})
.catch((err) => console.error(err))