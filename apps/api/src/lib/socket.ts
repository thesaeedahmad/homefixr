/**
 * Socket.io setup for real-time chat.
 *
 * Connections are authenticated with the same JWT used by the REST API (passed
 * in the handshake). A client joins a room named after the job id; messages are
 * persisted via REST and then pushed to that room with emitToJob(). Keeping the
 * socket layer thin (auth + room join + emit) avoids duplicating business logic.
 */
import { Server } from 'socket.io';
import type { Server as HttpServer } from 'http';
import { verifyToken } from './jwt';
import { env } from './env';
import { logger } from './logger';
import { assertParticipant } from '../services/chat.service';

let io: Server | null = null;

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, { cors: { origin: env.webOrigin } });

  // Authenticate every socket connection using the JWT from the handshake.
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error('Authentication required'));
    try {
      const payload = verifyToken(token);
      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    // A client asks to join a job conversation; we verify they belong to it.
    socket.on('chat:join', async (jobId: string) => {
      try {
        await assertParticipant(jobId, socket.data.userId as string);
        socket.join(jobId);
      } catch {
        // Unauthorized join attempts are simply ignored.
      }
    });
  });

  logger.info('Socket.io initialised');
  return io;
}

/** Pushes an event to everyone in a job's room. No-op if sockets aren't ready. */
export function emitToJob(jobId: string, event: string, payload: unknown): void {
  io?.to(jobId).emit(event, payload);
}
