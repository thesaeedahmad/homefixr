/**
 * Review routes (REST). Mounted at /api.
 *
 *   POST /api/jobs/:jobId/review        — CUSTOMER reviews a completed job
 *   GET  /api/jobs/:jobId/review        — the review for a job (or null)
 *   GET  /api/providers/:providerId/reviews — a provider's reviews
 */
import { Router } from 'express';
import { reviewController } from '../controllers/review.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { reviewSchema } from '../schemas/review.schema';

const router = Router();

router.post(
  '/jobs/:jobId/review',
  authenticate,
  authorize('CUSTOMER'),
  validate(reviewSchema),
  asyncHandler(reviewController.create),
);
router.get('/jobs/:jobId/review', authenticate, asyncHandler(reviewController.getForJob));
router.get(
  '/providers/:providerId/reviews',
  authenticate,
  asyncHandler(reviewController.listForProvider),
);

export default router;
