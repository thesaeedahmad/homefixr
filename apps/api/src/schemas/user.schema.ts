/**
 * Validation schemas for profile & settings requests (Zod).
 *
 * updateProfileSchema covers the fields common to every user. Provider-only
 * professional fields (bio, hourly rate, categories) are intentionally NOT here
 * yet — they are added in the iteration that first uses them (bidding), to
 * avoid building unused fields now (KISS).
 *
 * All fields are optional so the client can send a partial update (PATCH
 * semantics), but at least one must be present.
 */
import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(80).optional(),
    phone: z.string().max(30).optional(),
    location: z.string().max(120).optional(),
    avatarUrl: z.string().url('Enter a valid image URL').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Provide at least one field to update',
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(100),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
