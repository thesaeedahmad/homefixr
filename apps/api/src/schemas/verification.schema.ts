/**
 * Validation schema for an admin's verification decision.
 * Only APPROVED or REJECTED are valid outcomes.
 */
import { z } from 'zod';

export const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
