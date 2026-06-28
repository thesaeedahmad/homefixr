/**
 * Authentication & authorisation middleware (RBAC).
 *
 *  - authenticate: verifies the Bearer JWT and attaches req.user. Use on any
 *    route that requires a logged-in user.
 *  - authorize(...roles): allows the request only if req.user.role is in the
 *    given list. Use after authenticate to restrict a route to certain roles.
 *
 * Together these implement Role-Based Access Control (FR-3) in one place, so
 * every protected route enforces access the same way (DRY, consistency).
 */
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../lib/jwt';

export interface AuthUser {
  id: string;
  role: string;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: { message: 'Authentication required' } });
  }

  try {
    const payload = verifyToken(header.slice('Bearer '.length));
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: 'Access denied' } });
    }
    next();
  };
}
