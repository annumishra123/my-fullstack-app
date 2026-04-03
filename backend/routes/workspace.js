import express from 'express'
import {validateRequest } from 'zod-express-middleware'
import { workspaceSchema, tokenSchema, inviteMemberSchema} from '../libs/validateSchema.js'
import { createWorkspace, 
    getWorkspaces, 
    getWorkspaceDetails, 
    getWorkspaceProjects,
    getWorkspaceStats,
    acceptInviteByToken,
    inviteUserToWorkspace,
    acceptGenerateInvite

} from '../controllers/workspace-controller.js'
import authMiddleware from '../middleware/auth-middleware.js'
import { z } from "zod";

const router =  express.Router()

router.post('/createWorkspace', authMiddleware, validateRequest({ body: workspaceSchema,}), createWorkspace)
router.get('/', authMiddleware, getWorkspaces)

router.get('/:workspaceId', authMiddleware, getWorkspaceDetails)
router.get('/:workspaceId/projects', authMiddleware, getWorkspaceProjects)
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);

router.post(
    "/accept-invite-token",
    authMiddleware,
    validateRequest({ body: tokenSchema }),
    acceptInviteByToken
  );

  router.post(
    "/:workspaceId/invite-member",
    authMiddleware,
    validateRequest({
      params: z.object({ workspaceId: z.string() }),
      body: inviteMemberSchema,
    }),
    inviteUserToWorkspace
  );


  router.post(
    "/:workspaceId/accept-generate-invite",
    authMiddleware,
    validateRequest({ params: z.object({ workspaceId: z.string() }) }),
    acceptGenerateInvite
  );

export default router