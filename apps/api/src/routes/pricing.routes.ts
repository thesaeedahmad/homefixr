/**
 * Pricing route (REST).
 *
 *   POST /api/pricing — fair-price recommendation for a category (and optional
 *   description / estimated hours). Requires a logged-in user.
 */
import { Router } from 'express';
import { pricingController } from '../controllers/pricing.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { pricingSchema } from '../schemas/pricing.schema';

const router = Router();

router.post('/', authenticate, validate(pricingSchema), asyncHandler(pricingController.suggest));

export default router;
