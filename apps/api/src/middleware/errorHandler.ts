/**
 * Centralised error handling.
 *
 * Keeping error formatting in ONE place (DRY) guarantees every error response
 * has the same shape: { error: { message } }. A consistent contract makes the
 * frontend's error handling simpler and is friendlier for HCI (predictable
 * recovery messages).
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

/** Handles any error thrown in a route/middleware. Must be registered LAST. */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  logger.error('Unhandled error', err.message);
  res.status(500).json({ error: { message: 'Internal Server Error' } });
}

/** Handles requests to routes that do not exist. */
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: { message: 'Not Found' } });
}
