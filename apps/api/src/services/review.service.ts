/**
 * Review service — business rules for rating a provider (Iteration 9).
 *
 * A customer may review only their own COMPLETED job, only the provider who did
 * the work, and only once per job.
 */
import { jobRepository } from '../repositories/job.repository';
import { bidRepository } from '../repositories/bid.repository';
import { reviewRepository } from '../repositories/review.repository';
import { AppError } from '../lib/errors';
import { ReviewInput } from '../schemas/review.schema';

export const reviewService = {
  async createReview(jobId: string, customerId: string, input: ReviewInput) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError(404, 'Job not found');
    if (job.customerId !== customerId) {
      throw new AppError(403, 'You can only review your own jobs');
    }
    if (job.status !== 'COMPLETED') {
      throw new AppError(409, 'You can review once the job is completed');
    }

    const accepted = await bidRepository.findAcceptedByJob(jobId);
    if (!accepted) throw new AppError(409, 'There is no provider to review');

    const existing = await reviewRepository.findByJob(jobId);
    if (existing) throw new AppError(409, 'You have already reviewed this job');

    return reviewRepository.create({
      jobId,
      customerId,
      providerId: accepted.providerId,
      rating: input.rating,
      comment: input.comment,
    });
  },

  getJobReview(jobId: string) {
    return reviewRepository.findByJob(jobId);
  },

  getProviderReviews(providerId: string) {
    return reviewRepository.listByProvider(providerId);
  },
};
