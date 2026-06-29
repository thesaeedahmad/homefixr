/**
 * User controller — thin HTTP layer for profile & settings.
 * Reads req.user (set by authenticate) and delegates to the user service.
 */
import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { AppError } from '../lib/errors';

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

  async uploadAvatar(req: Request, res: Response) {
    const file = req.file as Express.Multer.File | undefined;
    if (!file) throw new AppError(400, 'Please choose an image to upload');
    const profile = await userService.updateAvatar(req.user!.id, file.buffer);
    res.status(200).json({ user: profile });
  },
};
