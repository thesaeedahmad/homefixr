/**
 * Express type augmentation.
 *
 * Adds the optional `user` property to Express's Request so that, after the
 * `authenticate` middleware runs, controllers can read a typed `req.user`
 * without unsafe `as any` casts.
 */
import type { AuthUser } from '../middleware/auth';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export {};
