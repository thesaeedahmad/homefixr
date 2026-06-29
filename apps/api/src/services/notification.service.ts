/**
 * Notification service (Iteration 10).
 *
 * notify() is the single entry point other services call when something
 * happens that a user should know about (new bid, bid accepted, message,
 * payment, verification result). It records a row; the frontend reads the feed.
 *
 * notify() never throws to its caller — a failed notification must not break the
 * main action (e.g. placing a bid), so errors are swallowed and logged.
 */
import { notificationRepository } from '../repositories/notification.repository';
import { logger } from '../lib/logger';

export const notificationService = {
  async notify(userId: string, type: string, message: string, jobId?: string) {
    try {
      await notificationRepository.create({
        userId,
        type,
        payload: { message, jobId: jobId ?? null },
      });
    } catch (err) {
      logger.error('Failed to create notification', (err as Error).message);
    }
  },

  async list(userId: string) {
    const [notifications, unreadCount] = await Promise.all([
      notificationRepository.listByUser(userId),
      notificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  },

  markRead(id: string, userId: string) {
    return notificationRepository.markRead(id, userId);
  },

  markAllRead(userId: string) {
    return notificationRepository.markAllRead(userId);
  },
};
