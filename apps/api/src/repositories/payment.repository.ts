/**
 * Payment repository — data access for the escrow simulation.
 *
 * release() and refund() change the payment AND the job together inside a
 * transaction so the two never diverge.
 */
import { prisma } from '../lib/prisma';

export const paymentRepository = {
  findByJob(jobId: string) {
    return prisma.payment.findUnique({ where: { jobId } });
  },

  create(data: { jobId: string; bidId: string; amount: number }) {
    return prisma.payment.create({ data });
  },

  markWorkDone(id: string) {
    return prisma.payment.update({
      where: { id },
      data: { workMarkedDoneAt: new Date() },
    });
  },

  release(id: string, jobId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: { status: 'RELEASED', releasedAt: new Date() },
      });
      await tx.job.update({ where: { id: jobId }, data: { status: 'COMPLETED' } });
      return payment;
    });
  },

  refund(id: string, jobId: string) {
    return prisma.$transaction(async (tx) => {
      const payment = await tx.payment.update({
        where: { id },
        data: { status: 'REFUNDED' },
      });
      await tx.job.update({ where: { id: jobId }, data: { status: 'CLOSED' } });
      return payment;
    });
  },
};
