/**
 * Fraud-flag repository — data access for fraud detection flags.
 */
import { FraudStatus } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const fraudRepository = {
  create(data: { targetType: string; targetId: string; reason: string; score: number }) {
    return prisma.fraudFlag.create({ data });
  },

  list(status?: FraudStatus) {
    return prisma.fraudFlag.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  },

  updateStatus(id: string, status: FraudStatus) {
    return prisma.fraudFlag.update({ where: { id }, data: { status } });
  },
};
