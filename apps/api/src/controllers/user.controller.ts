/**
 * User controller — thin HTTP layer for profile & settings.
 * Reads req.user (set by authenticate) and delegates to the user service.
 */
import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  async getMe(req: Request, res: Response) {
    const profile = await userService.getProfile(req.user!.id);
    res.status(200).json({ user: profile });
  },

  async updateMe(req: Request, res: Response) {
    const profile = await userService.updateProfile(req.user!.id, req.body);
    res.status(200).json({ user: profile });
  },

  async changePassword(req: Request, res: Response) {
    const result = await userService.changePassword(req.user!.id, req.body);
    res.status(200).json(result);
  },
};
