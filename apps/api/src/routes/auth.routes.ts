/**
 * Authentication routes (REST).
 *
 *   POST /api/auth/register  — create a Customer or Provider account
 *   POST /api/auth/login     — exchange credentials for a JWT
 *   GET  /api/auth/me        — return the current user (requires a valid token)
 *
 * Each route composes small, single-purpose middleware:
 *   validate(schema) -> (authenticate) -> asyncHandler(controller)
 */
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { asyncHandler } from '../lib/asyncHandler';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validate(registerSchema), asyncHandler(authController.register));
router.post('/login', validate(loginSchema), asyncHandler(authController.login));
router.get('/me', authenticate, asyncHandler(authController.me));

export default router;
