/**
 * Chat service — business rules for one-to-one job messaging (Iteration 7).
 *
 * A job conversation has exactly two participants: the job's customer and the
 * provider whose bid was accepted. Chat therefore only "opens" once a provider
 * is hired. Nobody else may read or post in that conversation.
 */
import { AppError } from '../lib/errors';
import { jobRepository } from '../repositories/job.repository';
import { bidRepository } from '../repositories/bid.repository';
import { messageRepository } from '../repositories/message.repository';

async function getParticipants(jobId: string) {
  const job = await jobRepository.findById(jobId);
  if (!job) throw new AppError(404, 'Job not found');
  const accepted = await bidRepository.findAcceptedByJob(jobId);
  return {
    customerId: job.customerId,
    customerName: job.customer?.name ?? 'Customer',
    providerId: accepted?.providerId ?? null,
    providerName: accepted?.provider?.name ?? null,
  };
}

/** Throws unless the user is a participant AND a provider has been hired. */
export async function assertParticipant(jobId: string, userId: string) {
  const p = await getParticipants(jobId);
  const isCustomer = userId === p.customerId;
  const isProvider = p.providerId != null && userId === p.providerId;
  if (!isCustomer && !isProvider) {
    throw new AppError(403, 'You are not part of this conversation');
  }
  if (!p.providerId) {
    throw new AppError(409, 'Chat opens once a provider is hired');
  }
  return { ...p, otherId: isCustomer ? p.providerId : p.customerId };
}

export const chatService = {
  async getConversation(jobId: string, userId: string) {
    const p = await getParticipants(jobId);
    const isCustomer = userId === p.customerId;
    const isProvider = p.providerId != null && userId === p.providerId;
    if (!isCustomer && !isProvider) {
      throw new AppError(403, 'You are not part of this conversation');
    }
    // Customer viewing before hiring anyone: chat not open yet.
    if (!p.providerId) {
      return { available: false, otherParty: null, messages: [] };
    }
    const messages = await messageRepository.listByJob(jobId);
    const otherParty = isCustomer
      ? { id: p.providerId, name: p.providerName }
      : { id: p.customerId, name: p.customerName };
    return { available: true, otherParty, messages };
  },

  async sendMessage(jobId: string, senderId: string, body: string) {
    const ctx = await assertParticipant(jobId, senderId);
    return messageRepository.create({
      jobId,
      senderId,
      receiverId: ctx.otherId,
      body,
    });
  },
};
