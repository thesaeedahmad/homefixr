/**
 * Review repository — data access for reviews + the provider rating aggregate.
 *
 * create() writes the review AND recomputes the provider's ratingAvg/ratingCount
 * from ALL their reviews inside one transaction, so the aggregate (shown as a
 * trust signal on bids) is always consistent. It upserts the ProviderProfile in
 * case the provider has no profile row yet.
 */
import { prisma } from '../lib/prisma';

export const reviewRepository = {
  findByJob(jobId: string) {
    return prisma.review.findUnique({ where: { jobId } });
  },

  listByProvider(providerId: string) {
    return prisma.review.findMany({
      where: { providerId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },

  create(data: {
    jobId: string;
    customerId: string;
    providerId: string;
    rating: number;
    comment?: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const review = await tx.review.create({ data });
      const agg = await tx.review.aggregate({
        where: { providerId: data.providerId },
        _avg: { rating: true },
        _count: true,
      });
      await tx.providerProfile.upsert({
        where: { userId: data.providerId },
        update: { ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
        create: { userId: data.providerId, ratingAvg: agg._avg.rating ?? 0, ratingCount: agg._count },
      });
      return review;
    });
  },
};
