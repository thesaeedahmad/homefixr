/**
 * Validation schema for a price-recommendation request.
 * Reuses the fixed job categories. Description and hours are optional and only
 * refine the suggestion.
 */
import { z } from 'zod';
import { JOB_CATEGORIES } from './job.schema';

export const pricingSchema = z.object({
  category: z.enum(JOB_CATEGORIES),
  description: z.string().max(2000).optional(),
  estimatedHours: z.coerce.number().positive().optional(),
});

export type PricingInput = z.infer<typeof pricingSchema>;
