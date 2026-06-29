/**
 * Notification routes (REST). Mounted at /api.
 *
 *   GET   /api/notifications            — recent notifications + unread count
 *   PATCH /api/notifications/read-all   — mark all as read
 *   PATCH /api/notifications/:id/read   — mark one as read
 */
import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

router.get('/notifications', authenticate, asyncHandler(notificationController.list));
router.patch('/notifications/read-all', authenticate, asyncHandler(notificationController.markAllRead));
router.patch('/notifications/:id/read', authenticate, asyncHandler(notificationController.markRead));

export default router;
