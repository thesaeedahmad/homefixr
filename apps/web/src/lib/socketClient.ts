/**
 * Socket.io client (singleton).
 *
 * Connects to the API origin (the API base URL minus the /api path) and
 * authenticates with the stored JWT. One shared socket is reused across the app.
 */
import { io, Socket } from 'socket.io-client';
import { getToken } from './auth';

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api').replace(
  /\/api\/?$/,
  '',
);

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_ORIGIN, { auth: { token: getToken() } });
  }
  return socket;
}
