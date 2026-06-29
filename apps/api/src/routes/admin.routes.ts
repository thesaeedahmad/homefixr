/**
 * Admin routes (REST). Mounted at /api/admin. All require the ADMIN role.
 *
 *   GET   /api/admin/overview          — dashboard counts
 *   GET   /api/admin/users             — all users
 *   GET   /api/admin/jobs              — all jobs
 *   GET   /api/admin/fraud-flags       — fraud flags (optional ?status=OPEN)
 *   PATCH /api/admin/fraud-flags/:id   — dismiss/confirm a flag
 */
import { Router } from 'express';
import { adminController } from '../controllers/admin.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { fraudReviewSchema } from '../schemas/fraud.schema';

const router = Router();

// Every admin route is guarded by authenticate + authorize('ADMIN').
router.use(authenticate, authorize('ADMIN'));

router.get('/overview', asyncHandler(adminController.overview));
router.get('/users', asyncHandler(adminController.users));
router.get('/jobs', asyncHandler(adminController.jobs));
router.get('/fraud-flags', asyncHandler(adminController.fraudFlags));
router.patch('/fraud-flags/:id', validate(fraudReviewSchema), asyncHandler(adminController.reviewFraud));

export default router;
