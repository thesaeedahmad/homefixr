/**
 * Job service — business logic for posting and managing jobs.
 *
 * Ownership and lifecycle rules live here:
 *  - only the job's owner may edit or cancel it
 *  - only OPEN jobs may be edited or cancelled (FR-11/FR-12)
 * Photos are uploaded to Cloudinary and stored as URLs on the job.
 */
import { JobCategory } from '@prisma/client';
import { jobRepository } from '../repositories/job.repository';
import { uploadImage } from '../lib/cloudinary';
import { AppError } from '../lib/errors';
import { CreateJobInput, UpdateJobInput } from '../schemas/job.schema';

export const jobService = {
  async createJob(customerId: string, input: CreateJobInput, photoBuffers: Buffer[]) {
    const photos: string[] = [];
    for (const buffer of photoBuffers) {
      const { url } = await uploadImage(buffer, 'homefixr/jobs');
      photos.push(url);
    }
    return jobRepository.create({ customerId, ...input, photos });
  },

  listOpenJobs(filters: { category?: JobCategory; location?: string }) {
    return jobRepository.findOpen(filters);
  },

  async getJob(id: string) {
    const job = await jobRepository.findById(id);
    if (!job) throw new AppError(404, 'Job not found');
    return job;
  },

  getMyJobs(customerId: string) {
    return jobRepository.findByCustomer(customerId);
  },

  async updateJob(jobId: string, customerId: string, input: UpdateJobInput) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError(404, 'Job not found');
    if (job.customerId !== customerId) {
      throw new AppError(403, 'You can only edit your own jobs');
    }
    if (job.status !== 'OPEN') {
      throw new AppError(409, 'Only open jobs can be edited');
    }
    return jobRepository.update(jobId, input);
  },

  async cancelJob(jobId: string, customerId: string) {
    const job = await jobRepository.findById(jobId);
    if (!job) throw new AppError(404, 'Job not found');
    if (job.customerId !== customerId) {
      throw new AppError(403, 'You can only cancel your own jobs');
    }
    if (job.status !== 'OPEN') {
      throw new AppError(409, 'Only open jobs can be cancelled');
    }
    return jobRepository.updateStatus(jobId, 'CLOSED');
  },
};
