/**
 * Generic request-body validation middleware.
 *
 * Usage: router.post('/x', validate(someSchema), handler)
 *
 * If validation fails we return 400 with the first human-readable message. On
 * success we replace req.body with the parsed (and typed) data. One reusable
 * middleware validates every endpoint consistently (DRY + error prevention).
 */
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues[0]?.message ?? 'Invalid input';
      return res.status(400).json({ error: { message } });
    }
    req.body = result.data;
    next();
  };
}
