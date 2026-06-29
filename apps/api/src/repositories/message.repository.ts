/**
 * Message repository — database access for chat messages.
 */
import { prisma } from '../lib/prisma';

export const messageRepository = {
  listByJob(jobId: string) {
    return prisma.message.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });
  },

  create(data: { jobId: string; senderId: string; receiverId: string; body: string }) {
    return prisma.message.create({ data });
  },
};
