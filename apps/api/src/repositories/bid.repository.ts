/**
 * Bid repository — database access for bids.
 *
 * acceptTransaction() performs the multi-row state change atomically: the
 * chosen bid becomes ACCEPTED, all other bids on the job become REJECTED, and
 * the job moves to IN_PROGRESS. A transaction guarantees these never diverge.
 */
import { prisma } from '../lib/prisma';

export const bidRepository = {
  create(data: {
    jobId: string;
    providerId: string;
    hourlyRate: number;
    estimatedHours: number;
    equipmentCost: number;
    totalAmount: number;
    message?: string;
  }) {
    return prisma.bid.create({ data });
  },

  /** A provider may bid only once per job. */
  existingBid(jobId: string, providerId: string) {
    return prisma.bid.findFirst({ where: { jobId, providerId } });
  },

  /** Bids on a job, cheapest first, with the provider's trust signals. */
  findByJob(jobId: string) {
    return prisma.bid.findMany({
      where: { jobId },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            isVerified: true,
            providerProfile: { select: { ratingAvg: true, ratingCount: true } },
          },
        },
      },
      orderBy: { totalAmount: 'asc' },
    });
  },

  findByProvider(providerId: string) {
    return prisma.bid.findMany({
      where: { providerId },
      include: { job: { select: { id: true, title: true, status: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  findByIdWithJob(id: string) {
    return prisma.bid.findUnique({ where: { id }, include: { job: true } });
  },

  /** The accepted bid on a job (the assigned provider), if any. */
  findAcceptedByJob(jobId: string) {
    return prisma.bid.findFirst({
      where: { jobId, status: 'ACCEPTED' },
      include: { provider: { select: { id: true, name: true } } },
    });
  },

  acceptTransaction(bidId: string, jobId: string) {
    return prisma.$transaction(async (tx) => {
      const accepted = await tx.bid.update({
        where: { id: bidId },
        data: { status: 'ACCEPTED' },
      });
      await tx.bid.updateMany({
        where: { jobId, id: { not: bidId } },
        data: { status: 'REJECTED' },
      });
      await tx.job.update({ where: { id: jobId }, data: { status: 'IN_PROGRESS' } });
      return accepted;
    });
  },
};
