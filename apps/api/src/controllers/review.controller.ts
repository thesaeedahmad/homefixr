/** Review controller — thin HTTP layer. */
import { Request, Response } from 'express';
import { reviewService } from '../services/review.service';

export const reviewController = {
  async create(req: Request, res: Response) {
    const review = await reviewService.createReview(req.params.jobId, req.user!.id, req.body);
    res.status(201).json({ review });
  },

  async getForJob(req: Request, res: Response) {
    const review = await reviewService.getJobReview(req.params.jobId);
    res.status(200).json({ review });
  },

  async listForProvider(req: Request, res: Response) {
    const reviews = await reviewService.getProviderReviews(req.params.providerId);
    res.status(200).json({ reviews });
  },
};
