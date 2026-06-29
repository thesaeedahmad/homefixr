/**
 * Pricing service — turns a job/bid context into a price recommendation by
 * calling the AI service. It maps the free-text description to a coarse
 * complexity score (1-5) so the model has a useful signal even before hours
 * are known.
 */
import { predictPrice } from '../lib/aiClient';
import { PricingInput } from '../schemas/pricing.schema';

function complexityFromDescription(description?: string): number {
  if (!description) return 3;
  const length = description.trim().length;
  if (length < 60) return 2;
  if (length < 160) return 3;
  if (length < 320) return 4;
  return 5;
}

export const pricingService = {
  getRecommendation(input: PricingInput) {
    return predictPrice({
      category: input.category,
      complexity: complexityFromDescription(input.description),
      estimatedHours: input.estimatedHours,
    });
  },
};
