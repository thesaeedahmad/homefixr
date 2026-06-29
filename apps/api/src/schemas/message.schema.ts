/** Validation schema for a chat message. */
import { z } from 'zod';

export const messageSchema = z.object({
  body: z.string().min(1, 'Message cannot be empty').max(1000),
});

export type MessageInput = z.infer<typeof messageSchema>;
