/**
 * Notification repository — data access for in-app notifications.
 */
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const notificationRepository = {
  create(data: { userId: string; type: string; payload: Prisma.InputJsonValue }) {
    return prisma.notification.create({ data });
  },

  listByUser(userId: string) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  },

  countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  },

  markRead(id: string, userId: string) {
    // updateMany (not update) so the userId guard prevents reading others' rows.
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  },

  markAllRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  },
};
