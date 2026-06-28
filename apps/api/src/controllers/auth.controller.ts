/**
 * Auth controller — the thin HTTP layer.
 *
 * Controllers translate between HTTP and the service layer: read the request,
 * call the service, send the response with the right status code. They contain
 * NO business rules (those live in auth.service) — keeping them thin makes the
 * logic easy to test and reuse.
 */
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export const authController = {
  async register(req: Request, res: Response) {
    const result = await authService.register(req.body);
    res.status(201).json(result); // 201 Created
  },

  async login(req: Request, res: Response) {
    const result = await authService.login(req.body);
    res.status(200).json(result);
  },

  async me(req: Request, res: Response) {
    // req.user is set by the authenticate middleware.
    const user = await authService.getProfile(req.user!.id);
    res.status(200).json({ user });
  },
};
