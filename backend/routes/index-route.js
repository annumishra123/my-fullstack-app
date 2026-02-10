import express from 'express'
import authRoutes from './auth-route.js'
import workSpace from './workspace.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/workspace', workSpace)

export default router





