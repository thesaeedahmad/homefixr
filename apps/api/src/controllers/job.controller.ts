/**
 * Job controller — thin HTTP layer.
 * Reads uploaded photos (multer) and query filters, delegates to the service.
 */
import { Request, Response } from 'express';
import { JobCategory } from '@prisma/client';
import { jobService } from '../services/job.service';
import { JOB_CATEGORIES } from '../schemas/job.schema';

/** Returns the category only if it is one of the allowed values, else undefined. */
function parseCategory(value: unknown): JobCategory | undefined {
  if (typeof value === 'string' && (JOB_CATEGORIES as readonly string[]).includes(value)) {
    return value as JobCategory;
  }
  return undefined;
}

export const jobController = {
  async create(req: Request, res: Response) {
    const files = (req.files as Express.Multer.File[] | undefined) ?? [];
    const job = await jobService.createJob(
      req.user!.id,
      req.body,
      files.map((f) => f.buffer),
    );
    res.status(201).json({ job });
  },

  async list(req: Request, res: Response) {
    const location = typeof req.query.location === 'string' ? req.query.location : undefined;
    const jobs = await jobService.listOpenJobs({
      category: parseCategory(req.query.category),
      location: location || undefined,
    });
    res.status(200).json({ jobs });
  },

  async mine(req: Request, res: Response) {
    const jobs = await jobService.getMyJobs(req.user!.id);
    res.status(200).json({ jobs });
  },

  async getOne(req: Request, res: Response) {
    const job = await jobService.getJob(req.params.id);
    res.status(200).json({ job });
  },

  async update(req: Request, res: Response) {
    const job = await jobService.updateJob(req.params.id, req.user!.id, req.body);
    res.status(200).json({ job });
  },

  async cancel(req: Request, res: Response) {
    const job = await jobService.cancelJob(req.params.id, req.user!.id);
    res.status(200).json({ job });
  },
};
