/**
 * Admin repository — read-only aggregate queries for the admin dashboard.
 */
import { prisma } from '../lib/prisma';

export const adminRepository = {
  async overview() {
    const [users, open, inProgress, completed, pendingVerifications, openFraud] = await Promise.all([
      prisma.user.count(),
      prisma.job.count({ where: { status: 'OPEN' } }),
      prisma.job.count({ where: { status: 'IN_PROGRESS' } }),
      prisma.job.count({ where: { status: 'COMPLETED' } }),
      prisma.providerProfile.count({ where: { verificationStatus: 'PENDING' } }),
      prisma.fraudFlag.count({ where: { status: 'OPEN' } }),
    ]);
    return {
      users,
      jobs: { open, inProgress, completed },
      pendingVerifications,
      openFraud,
    };
  },

  listUsers() {
    return prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  },

  listJobs() {
    return prisma.job.findMany({
      select: {
        id: true,
        title: true,
        category: true,
        status: true,
        createdAt: true,
        customer: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  },
};
