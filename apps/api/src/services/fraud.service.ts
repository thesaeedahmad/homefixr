/**
 * Fraud detection (Iteration 11) — lightweight, rule-based (per the proposal).
 *
 * The system runs simple deterministic rules and records a FraudFlag for an
 * admin to review. We deliberately avoid a heavy ML model (KISS); the rules are
 * easy to explain at viva and easy to extend.
 *
 * Rules:
 *  - Low-ball bid: an unusually low hourly rate, or a total far below the
 *    customer's stated budget.
 *  - Possible duplicate account: a new account whose name matches an existing
 *    user's name.
 *
 * createFlag() never throws to its caller — flagging must not break the action
 * that triggered it (placing a bid, registering).
 */
import { FraudStatus } from '@prisma/client';
import { fraudRepository } from '../repositories/fraud.repository';
import { userRepository } from '../repositories/user.repository';
import { logger } from '../lib/logger';

const HOURLY_RATE_FLOOR = 50; // PKR — below this looks suspicious
const BUDGET_LOWBALL_RATIO = 0.3; // < 30% of the customer's budget hint

async function createFlag(targetType: string, targetId: string, reason: string, score: number) {
  try {
    await fraudRepository.create({ targetType, targetId, reason, score });
  } catch (err) {
    logger.error('Failed to create fraud flag', (err as Error).message);
  }
}

export const fraudService = {
  async checkBid(
    bid: { id: string; hourlyRate: number; totalAmount: number },
    job: { budgetHint: number | null },
  ) {
    const reasons: string[] = [];
    if (bid.hourlyRate < HOURLY_RATE_FLOOR) {
      reasons.push('Unusually low hourly rate');
    }
    if (job.budgetHint && bid.totalAmount < job.budgetHint * BUDGET_LOWBALL_RATIO) {
      reasons.push("Bid far below the customer's budget");
    }
    if (reasons.length) {
      await createFlag('BID', bid.id, reasons.join('; '), Math.min(1, 0.2 + 0.4 * reasons.length));
    }
  },

  async checkRegistration(userId: string, name: string) {
    const matches = await userRepository.findByName(name);
    const others = matches.filter((u) => u.id !== userId);
    if (others.length > 0) {
      await createFlag(
        'USER',
        userId,
        'Possible duplicate account (name matches an existing user)',
        0.5,
      );
    }
  },

  listFlags(status?: FraudStatus) {
    return fraudRepository.list(status);
  },

  reviewFlag(id: string, status: FraudStatus) {
    return fraudRepository.updateStatus(id, status);
  },
};
