/**
 * Bid controller — thin HTTP layer for the bidding workflow.
 */
import { Request, Response } from 'express';
import { bidService } from '../services/bid.service';

export const bidController = {
  async create(req: Request, res: Response) {
    const bid = await bidService.createBid(req.user!.id, req.params.jobId, req.body);
    res.status(201).json({ bid });
  },

  async listForJob(req: Request, res: Response) {
    const bids = await bidService.listBidsForJob(req.params.jobId, req.user!.id);
    res.status(200).json({ bids });
  },

  async mine(req: Request, res: Response) {
    const bids = await bidService.getMyBids(req.user!.id);
    res.status(200).json({ bids });
  },

  async accept(req: Request, res: Response) {
    const bid = await bidService.acceptBid(req.params.id, req.user!.id);
    res.status(200).json({ bid });
  },
};
