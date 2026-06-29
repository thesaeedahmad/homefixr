/**
 * Bid service — business logic for offers (Iteration 5).
 *
 * Rules enforced here:
 *  - a provider can bid only on an OPEN job, and only once per job
 *  - the total is computed server-side (rate × hours + equipment) — FR-14
 *  - only the job owner can view its bids or accept one
 *  - accepting is only possible while the job is OPEN and the bid is PENDING
 */
import { jobRepository } from '../repositories/job.repository';
import { bidRepository } from '../repositories/bid.repository';
import { AppError } from '../lib/errors';
import { CreateBidInput } from '../schemas/bid.schema';

export const bidService = {
  async createBid(providerId: string, jobId: string, input: CreateBidInput) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError(404, 'Job not found');
    if (job.status !== 'OPEN') {
      throw new AppError(409, 'This job is no longer open for bids');
    }

    const existing = await bidRepository.existingBid(jobId, providerId);
    if (existing) {
      throw new AppError(409, 'You have already placed a bid on this job');
    }

    const totalAmount = input.hourlyRate * input.estimatedHours + input.equipmentCost;
    return bidRepository.create({
      jobId,
      providerId,
      hourlyRate: input.hourlyRate,
      estimatedHours: input.estimatedHours,
      equipmentCost: input.equipmentCost,
      totalAmount,
      message: input.message,
    });
  },

  async listBidsForJob(jobId: string, customerId: string) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError(404, 'Job not found');
    if (job.customerId !== customerId) {
      throw new AppError(403, 'You can only view bids on your own jobs');
    }
    return bidRepository.findByJob(jobId);
  },

  getMyBids(providerId: string) {
    return bidRepository.findByProvider(providerId);
  },

  async acceptBid(bidId: string, customerId: string) {
    const bid = await bidRepository.findByIdWithJob(bidId);
    if (!bid) throw new AppError(404, 'Bid not found');
    if (bid.job.customerId !== customerId) {
      throw new AppError(403, 'You can only accept bids on your own jobs');
    }
    if (bid.job.status !== 'OPEN') {
      throw new AppError(409, 'This job is no longer open');
    }
    if (bid.status !== 'PENDING') {
      throw new AppError(409, 'This bid can no longer be accepted');
    }
    return bidRepository.acceptTransaction(bidId, bid.jobId);
  },
};
