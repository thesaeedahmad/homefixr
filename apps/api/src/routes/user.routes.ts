/**
 * User profile & settings routes (REST). All require a valid token.
 *
 *   GET   /api/users/me           — current user's profile
 *   PATCH /api/users/me           — update profile fields
 *   PATCH /api/users/me/password  — change password
 *
 * Every route runs `authenticate` first, then validates the body where needed.
 */
import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../lib/asyncHandler';
import { upload } from '../middleware/upload';
import { updateProfileSchema, changePasswordSchema } from '../schemas/user.schema';

const router = Router();

router.get('/me', authenticate, asyncHandler(userController.getMe));
router.patch('/me', authenticate, validate(updateProfileSchema), asyncHandler(userController.updateMe));
router.patch(
  '/me/password',
  authenticate,
  validate(changePasswordSchema),
  asyncHandler(userController.changePassword),
);
router.post(
  '/me/avatar',
  authenticate,
  upload.single('avatar'),
  asyncHandler(userController.uploadAvatar),
);

export default router;
