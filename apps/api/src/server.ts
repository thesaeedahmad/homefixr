/**
 * Server entry point.
 *
 * Single responsibility: create the app and start listening. Keeping this tiny
 * (and separate from app.ts) follows the Single Responsibility Principle.
 */
import { createApp } from './app';
import { env } from './lib/env';
import { logger } from './lib/logger';

const app = createApp();

app.listen(env.port, () => {
  logger.info(`HomeFixr API listening on http://localhost:${env.port}`);
});
