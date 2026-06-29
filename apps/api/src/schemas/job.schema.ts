/**
 * Validation schemas for jobs (Zod).
 *
 * JOB_CATEGORIES is the single fixed list (FR-10). budgetHint is optional and
 * may arrive as a string (multipart form) or be empty, so we normalise an empty
 * value to undefined before coercing to a positive number.
 */
import { z } from 'zod';

export const JOB_CATEGORIES = [
  'PLUMBING',
  'ELECTRICAL',
  'APPLIANCES',
  'HANDYMAN',
  'CLEANING',
] as const;

const budgetHint = z.preprocess(
  (v) => (v === '' || v === undefined || v === null ? undefined : v),
  z.coerce.number().positive('Budget must be a positive number').optional(),
);

export const createJobSchema = z.object({
  category: z.enum(JOB_CATEGORIES),
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  location: z.string().min(2, 'Location is required').max(120),
  budgetHint,
});

export const updateJobSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(120).optional(),
    description: z.string().min(10, 'Description must be at least 10 characters').max(2000).optional(),
    location: z.string().min(2, 'Location is required').max(120).optional(),
    budgetHint,
  })
  .refine((data) => Object.values(data).some((v) => v !== undefined), {
    message: 'Provide at least one field to update',
  });

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
