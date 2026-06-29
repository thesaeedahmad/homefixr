/**
 * Pricing controller — thin HTTP layer. Returns the recommendation, which may
 * be null if the AI service is unavailable (the UI then hides the hint).
 */
import { Request, Response } from 'express';
import { pricingService } from '../services/pricing.service';

export const pricingController = {
  async suggest(req: Request, res: Response) {
    const recommendation = await pricingService.getRecommendation(req.body);
    res.status(200).json({ recommendation });
  },
};
