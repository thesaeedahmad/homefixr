/**
 * Express application factory.
 *
 * We build and return the app here WITHOUT starting the server. Separating the
 * app from the listener (server.ts) means the app can be imported directly in
 * tests (e.g. Supertest) without binding a network port — a clean, testable
 * architecture decision.
 *
 * Middleware order matters and is intentional:
 *   1. helmet()        secure HTTP headers (mitigates common web attacks)
 *   2. cors()          allow only our web frontend's origin
 *   3. express.json()  parse JSON request bodies
 *   4. routes          feature endpoints
 *   5. notFound        404 for anything unmatched
 *   6. errorHandler    central error formatter (always LAST)
 */
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './lib/env';
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import { errorHandler, notFound } from './middleware/errorHandler';

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.webOrigin }));
  app.use(express.json());

  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
