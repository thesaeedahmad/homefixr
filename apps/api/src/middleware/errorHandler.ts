/**
 * Centralised error handling.
 *
 * Keeping error formatting in ONE place (DRY) guarantees every error response
 * has the same shape: { error: { message } }. A consistent contract makes the
 * frontend's error handling simpler and is friendlier for HCI (predictable
 * recovery messages).
 *
 * Errors may carry a numeric `status` (e.g. AppError thrown by a service). For
 * client errors (< 500) we return the error's own message; for server errors
 * we hide internal details and log them.
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

interface HttpError extends Error {
  status?: number;
}

/** Handles any error thrown in a route/middleware. Must be registered LAST. */
export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const status = err.status ?? 500;
  if (status >= 500) {
    logger.error('Unhandled error', err.message);
  }
  const message = status < 500 ? err.message : 'Internal Server Error';
  res.status(status).json({ error: { message } });
}

/** Handles requests to routes that do not exist. */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: 'Not Found' } });
}
