import express from 'express'
import authRoutes from './auth-route.js'
import workSpace from './workspace.js'
import projectRoutes from './project-route.js'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/workspaces', workSpace)
router.use('/projects', projectRoutes)

export default router





