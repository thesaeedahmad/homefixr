/** Validation schema for an admin's fraud-flag decision. */
import { z } from 'zod';

export const fraudReviewSchema = z.object({
  status: z.enum(['DISMISSED', 'CONFIRMED']),
});

export type FraudReviewInput = z.infer<typeof fraudReviewSchema>;
