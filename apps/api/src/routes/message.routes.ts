/**
 * Chat message routes (REST). Mounted at /api.
 *
 *   GET  /api/jobs/:jobId/messages — the conversation (participants only)
 *   POST /api/jobs/:jobId/messages — send a message (also pushed via Socket.io)
 */
import { Router } from 'express';
import { messageController } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { messageSchema } from '../schemas/message.schema';

const router = Router();

router.get('/jobs/:jobId/messages', authenticate, asyncHandler(messageController.list));
router.post(
  '/jobs/:jobId/messages',
  authenticate,
  validate(messageSchema),
  asyncHandler(messageController.send),
);

export default router;
