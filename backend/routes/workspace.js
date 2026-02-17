import express from 'express'
import {z} from 'zod'
import {validateRequest } from 'zod-express-middleware'
import { workspaceSchema} from '../libs/validateSchema.js'
import { createWorkspace, getWorkspaces, getWorkspaceDetails, getWorkspaceProjects} from '../controllers/workspace-controller.js'
import authMiddleware from '../middleware/auth-middleware.js'

const router =  express.Router()

router.post('/createWorkspace', authMiddleware, validateRequest({ body: workspaceSchema,}), createWorkspace)
router.get('/', authMiddleware, getWorkspaces)

router.get('/:workspaceId', authMiddleware, getWorkspaceDetails)
router.get('/:workspaceId/projects', authMiddleware, getWorkspaceProjects)


export default router