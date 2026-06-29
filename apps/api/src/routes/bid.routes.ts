/**
 * Bid routes (REST). Mounted at /api so paths read naturally:
 *
 *   POST  /api/jobs/:jobId/bids  — PROVIDER places a bid on a job
 *   GET   /api/jobs/:jobId/bids  — job owner (CUSTOMER) views all bids
 *   GET   /api/bids/mine         — PROVIDER lists their own bids
 *   PATCH /api/bids/:id/accept   — job owner accepts a bid
 */
import { Router } from 'express';
import { bidController } from '../controllers/bid.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { createBidSchema } from '../schemas/bid.schema';

const router = Router();

router.post(
  '/jobs/:jobId/bids',
  authenticate,
  authorize('PROVIDER'),
  validate(createBidSchema),
  asyncHandler(bidController.create),
);
router.get(
  '/jobs/:jobId/bids',
  authenticate,
  authorize('CUSTOMER'),
  asyncHandler(bidController.listForJob),
);
router.get('/bids/mine', authenticate, authorize('PROVIDER'), asyncHandler(bidController.mine));
router.patch('/bids/:id/accept', authenticate, authorize('CUSTOMER'), asyncHandler(bidController.accept));

export default router;
