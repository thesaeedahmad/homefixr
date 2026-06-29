/**
 * Admin controller — thin HTTP layer for the admin dashboard and fraud review.
 */
import { Request, Response } from 'express';
import { FraudStatus } from '@prisma/client';
import { adminService } from '../services/admin.service';
import { fraudService } from '../services/fraud.service';

export const adminController = {
  async overview(_req: Request, res: Response) {
    res.status(200).json(await adminService.overview());
  },

  async users(_req: Request, res: Response) {
    res.status(200).json({ users: await adminService.listUsers() });
  },

  async jobs(_req: Request, res: Response) {
    res.status(200).json({ jobs: await adminService.listJobs() });
  },

  async fraudFlags(req: Request, res: Response) {
    const status = req.query.status as FraudStatus | undefined;
    const valid = status && ['OPEN', 'DISMISSED', 'CONFIRMED'].includes(status) ? status : undefined;
    res.status(200).json({ flags: await fraudService.listFlags(valid) });
  },

  async reviewFraud(req: Request, res: Response) {
    const flag = await fraudService.reviewFlag(req.params.id, req.body.status);
    res.status(200).json({ flag });
  },
};
