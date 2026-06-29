/**
 * Message controller — thin HTTP layer for chat.
 *
 * The message is persisted by the service, then pushed to the job room over
 * Socket.io. (Emitting lives here, in the transport layer, so the service has no
 * dependency on the socket module — keeping the layers decoupled.)
 */
import { Request, Response } from 'express';
import { chatService } from '../services/chat.service';
import { emitToJob } from '../lib/socket';

export const messageController = {
  async list(req: Request, res: Response) {
    const conversation = await chatService.getConversation(req.params.jobId, req.user!.id);
    res.status(200).json(conversation);
  },

  async send(req: Request, res: Response) {
    const message = await chatService.sendMessage(req.params.jobId, req.user!.id, req.body.body);
    emitToJob(req.params.jobId, 'chat:message', message);
    res.status(201).json({ message });
  },
};
