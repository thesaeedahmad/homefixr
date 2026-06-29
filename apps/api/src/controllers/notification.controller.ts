/** Notification controller — thin HTTP layer. */
import { Request, Response } from 'express';
import { notificationService } from '../services/notification.service';

export const notificationController = {
  async list(req: Request, res: Response) {
    const data = await notificationService.list(req.user!.id);
    res.status(200).json(data);
  },

  async markRead(req: Request, res: Response) {
    await notificationService.markRead(req.params.id, req.user!.id);
    res.status(200).json({ ok: true });
  },

  async markAllRead(req: Request, res: Response) {
    await notificationService.markAllRead(req.user!.id);
    res.status(200).json({ ok: true });
  },
};
