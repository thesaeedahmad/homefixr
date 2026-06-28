/**
 * asyncHandler — wraps an async Express route handler so any rejected promise
 * is forwarded to the central error handler via next(err).
 *
 * Express 4 does not catch errors from async functions automatically. This tiny
 * helper removes the need for a try/catch in every controller (DRY).
 */
import { RequestHandler } from 'express';

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
