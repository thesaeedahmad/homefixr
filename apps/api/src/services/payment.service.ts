/**
 * Payment service — the escrow SIMULATION state machine (Iteration 8).
 *
 * No real money moves. The flow models trust:
 *   1. pay        (customer)  -> Payment HELD            (job already IN_PROGRESS)
 *   2. markWorkDone (provider) -> sets workMarkedDoneAt   (still HELD)
 *   3. release    (customer)  -> Payment RELEASED + job COMPLETED
 *   (dispute      (customer)  -> Payment REFUNDED + job CLOSED — minimal withhold path)
 *
 * Each step validates the actor and the current state, so the machine can only
 * advance in the intended order.
 */
import { jobRepository } from '../repositories/job.repository';
import { bidRepository } from '../repositories/bid.repository';
import { paymentRepository } from '../repositories/payment.repository';
import { notificationService } from './notification.service';
import { AppError } from '../lib/errors';

async function loadContext(jobId: string) {
  const job = await jobRepository.findById(jobId);
  if (!job) throw new AppError(404, 'Job not found');
  const accepted = await bidRepository.findAcceptedByJob(jobId);
  return { job, accepted };
}

export const paymentService = {
  async getPayment(jobId: string, userId: string) {
    const { job, accepted } = await loadContext(jobId);
    const isCustomer = job.customerId === userId;
    const isProvider = accepted?.providerId === userId;
    if (!isCustomer && !isProvider) {
      throw new AppError(403, 'You are not part of this job');
    }
    return paymentRepository.findByJob(jobId);
  },

  async pay(jobId: string, customerId: string) {
    const { job, accepted } = await loadContext(jobId);
    if (job.customerId !== customerId) throw new AppError(403, 'Only the job owner can pay');
    if (job.status !== 'IN_PROGRESS') {
      throw new AppError(409, 'Payment is available once you have hired a provider');
    }
    if (!accepted) throw new AppError(409, 'No accepted bid for this job');
    const existing = await paymentRepository.findByJob(jobId);
    if (existing) throw new AppError(409, 'Payment already exists for this job');
    const payment = await paymentRepository.create({
      jobId,
      bidId: accepted.id,
      amount: accepted.totalAmount,
    });
    await notificationService.notify(
      accepted.providerId,
      'PAYMENT_FUNDED',
      `The customer funded "${job.title}" — you can start the work`,
      jobId,
    );
    return payment;
  },

  async markWorkDone(jobId: string, providerId: string) {
    const { accepted } = await loadContext(jobId);
    if (!accepted || accepted.providerId !== providerId) {
      throw new AppError(403, 'Only the assigned provider can mark the work done');
    }
    const payment = await paymentRepository.findByJob(jobId);
    if (!payment) throw new AppError(409, 'The customer has not funded this job yet');
    if (payment.status !== 'HELD') throw new AppError(409, 'This payment is no longer held');
    if (payment.workMarkedDoneAt) throw new AppError(409, 'You have already marked the work as done');
    return paymentRepository.markWorkDone(payment.id);
  },

  async release(jobId: string, customerId: string) {
    const { job, accepted } = await loadContext(jobId);
    if (job.customerId !== customerId) throw new AppError(403, 'Only the job owner can release payment');
    const payment = await paymentRepository.findByJob(jobId);
    if (!payment) throw new AppError(409, 'No payment to release');
    if (payment.status !== 'HELD') throw new AppError(409, 'This payment is no longer held');
    if (!payment.workMarkedDoneAt) {
      throw new AppError(409, 'The provider has not marked the work as done yet');
    }
    const released = await paymentRepository.release(payment.id, jobId);
    if (accepted) {
      await notificationService.notify(
        accepted.providerId,
        'PAYMENT_RELEASED',
        `Payment released for "${job.title}"`,
        jobId,
      );
    }
    return released;
  },

  async dispute(jobId: string, customerId: string) {
    const { job } = await loadContext(jobId);
    if (job.customerId !== customerId) throw new AppError(403, 'Only the job owner can dispute');
    const payment = await paymentRepository.findByJob(jobId);
    if (!payment) throw new AppError(409, 'No payment to dispute');
    if (payment.status !== 'HELD') throw new AppError(409, 'This payment is no longer held');
    return paymentRepository.refund(payment.id, jobId);
  },
};
