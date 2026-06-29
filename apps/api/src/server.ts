/**
 * Server entry point.
 *
 * We wrap the Express app in a Node HTTP server so Socket.io (real-time chat)
 * can share the same port. The app stays separately testable (see app.ts).
 */
import http from 'http';
import { createApp } from './app';
import { initSocket } from './lib/socket';
import { env } from './lib/env';
import { logger } from './lib/logger';

const app = createApp();
const server = http.createServer(app);

initSocket(server);

server.listen(env.port, () => {
  logger.info(`HomeFixr API listening on http://localhost:${env.port}`);
});
