/**
 * Job routes (REST).
 *
 *   POST  /api/jobs           — CUSTOMER posts a job (with optional photos)
 *   GET   /api/jobs           — browse OPEN jobs (filter: category, location)
 *   GET   /api/jobs/mine      — CUSTOMER lists their own jobs
 *   GET   /api/jobs/:id       — job detail
 *   PATCH /api/jobs/:id       — CUSTOMER edits their own OPEN job
 *   PATCH /api/jobs/:id/cancel — CUSTOMER cancels their own OPEN job
 *
 * Note: the specific "/mine" route is declared BEFORE "/:id" so it is not
 * captured by the id parameter.
 */
import { Router } from 'express';
import { jobController } from '../controllers/job.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { upload } from '../middleware/upload';
import { createJobSchema, updateJobSchema } from '../schemas/job.schema';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize('CUSTOMER'),
  upload.array('photos', 5),
  validate(createJobSchema),
  asyncHandler(jobController.create),
);
router.get('/', authenticate, asyncHandler(jobController.list));
router.get('/mine', authenticate, authorize('CUSTOMER'), asyncHandler(jobController.mine));
router.get('/:id', authenticate, asyncHandler(jobController.getOne));
router.patch(
  '/:id',
  authenticate,
  authorize('CUSTOMER'),
  validate(updateJobSchema),
  asyncHandler(jobController.update),
);
router.patch('/:id/cancel', authenticate, authorize('CUSTOMER'), asyncHandler(jobController.cancel));

export default router;
