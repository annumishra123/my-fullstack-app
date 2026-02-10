import express from 'express'
import {z} from 'zod'
import {validateRequest } from 'zod-express-middleware'
import { workspaceSchema} from '../libs/validateSchema.js'
import { createWorkspace} from '../controllers/workspace-controller.js'
import authMiddleware from '../middleware/auth-middleware.js'

const router =  express.Router()

router.post('/createWorkspace', authMiddleware, validateRequest({ body: workspaceSchema,}), createWorkspace)


export default router