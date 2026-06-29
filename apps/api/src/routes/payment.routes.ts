/**
 * Escrow payment routes (REST). Mounted at /api.
 *
 *   GET   /api/jobs/:jobId/payment            — participants view payment state
 *   POST  /api/jobs/:jobId/payment            — CUSTOMER funds escrow (-> HELD)
 *   PATCH /api/jobs/:jobId/payment/work-done  — PROVIDER marks work complete
 *   PATCH /api/jobs/:jobId/payment/release    — CUSTOMER releases (-> RELEASED, job COMPLETED)
 *   PATCH /api/jobs/:jobId/payment/dispute    — CUSTOMER disputes (-> REFUNDED, job CLOSED)
 */
import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';

const router = Router();

router.get('/jobs/:jobId/payment', authenticate, asyncHandler(paymentController.get));
router.post('/jobs/:jobId/payment', authenticate, authorize('CUSTOMER'), asyncHandler(paymentController.pay));
router.patch(
  '/jobs/:jobId/payment/work-done',
  authenticate,
  authorize('PROVIDER'),
  asyncHandler(paymentController.workDone),
);
router.patch(
  '/jobs/:jobId/payment/release',
  authenticate,
  authorize('CUSTOMER'),
  asyncHandler(paymentController.release),
);
router.patch(
  '/jobs/:jobId/payment/dispute',
  authenticate,
  authorize('CUSTOMER'),
  asyncHandler(paymentController.dispute),
);

export default router;
