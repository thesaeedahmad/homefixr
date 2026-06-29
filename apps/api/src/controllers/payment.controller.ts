/**
 * Payment controller — thin HTTP layer for the escrow simulation.
 */
import { Request, Response } from 'express';
import { paymentService } from '../services/payment.service';

export const paymentController = {
  async get(req: Request, res: Response) {
    const payment = await paymentService.getPayment(req.params.jobId, req.user!.id);
    res.status(200).json({ payment });
  },

  async pay(req: Request, res: Response) {
    const payment = await paymentService.pay(req.params.jobId, req.user!.id);
    res.status(201).json({ payment });
  },

  async workDone(req: Request, res: Response) {
    const payment = await paymentService.markWorkDone(req.params.jobId, req.user!.id);
    res.status(200).json({ payment });
  },

  async release(req: Request, res: Response) {
    const payment = await paymentService.release(req.params.jobId, req.user!.id);
    res.status(200).json({ payment });
  },

  async dispute(req: Request, res: Response) {
    const payment = await paymentService.dispute(req.params.jobId, req.user!.id);
    res.status(200).json({ payment });
  },
};
