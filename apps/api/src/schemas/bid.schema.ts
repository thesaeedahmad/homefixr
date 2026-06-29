/**
 * Validation schema for placing a bid (Zod).
 *
 * The total is NOT accepted from the client — the server computes it as
 * rate × hours + equipment (FR-14) so the breakdown is always trustworthy.
 * Values are coerced so they work whether sent as numbers or strings.
 */
import { z } from 'zod';

export const createBidSchema = z.object({
  hourlyRate: z.coerce.number().positive('Hourly rate must be greater than 0'),
  estimatedHours: z.coerce.number().positive('Estimated hours must be greater than 0'),
  equipmentCost: z.coerce.number().min(0, 'Equipment cost cannot be negative').default(0),
  message: z.string().max(500).optional(),
});

export type CreateBidInput = z.infer<typeof createBidSchema>;
