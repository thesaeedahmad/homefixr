/**
 * Identity verification routes (REST).
 *
 *   POST  /api/verification           — provider uploads ID + license images
 *   GET   /api/verification/me        — provider views their own status
 *   GET   /api/verification/pending   — ADMIN lists profiles awaiting review
 *   PATCH /api/verification/:id/review — ADMIN approves/rejects a profile
 *
 * This is the first use of authorize('PROVIDER') and authorize('ADMIN') —
 * the RBAC built in Iteration 1 now guards real, role-specific actions.
 */
import { Router } from 'express';
import { verificationController } from '../controllers/verification.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { upload } from '../middleware/upload';
import { reviewSchema } from '../schemas/verification.schema';

const router = Router();

// Provider actions
router.post(
  '/',
  authenticate,
  authorize('PROVIDER'),
  upload.fields([
    { name: 'idDocument', maxCount: 1 },
    { name: 'licenseDocument', maxCount: 1 },
  ]),
  asyncHandler(verificationController.submit),
);
router.get('/me', authenticate, authorize('PROVIDER'), asyncHandler(verificationController.getMine));

// Admin actions
router.get(
  '/pending',
  authenticate,
  authorize('ADMIN'),
  asyncHandler(verificationController.listPending),
);
router.patch(
  '/:id/review',
  authenticate,
  authorize('ADMIN'),
  validate(reviewSchema),
  asyncHandler(verificationController.review),
);

export default router;
