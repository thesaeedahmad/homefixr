/**
 * Verification controller — thin HTTP layer.
 * Reads the uploaded files (provided by multer as req.files) and delegates the
 * work to the verification service.
 */
import { Request, Response } from 'express';
import { DocumentType } from '@prisma/client';
import { verificationService } from '../services/verification.service';
import { AppError } from '../lib/errors';

export const verificationController = {
  async submit(req: Request, res: Response) {
    const files = req.files as Record<string, Express.Multer.File[]> | undefined;
    const idDoc = files?.idDocument?.[0];
    const licenseDoc = files?.licenseDocument?.[0];

    if (!idDoc || !licenseDoc) {
      throw new AppError(400, 'Both an ID document and a license document are required');
    }

    const verification = await verificationService.submitDocuments(req.user!.id, [
      { type: DocumentType.ID, buffer: idDoc.buffer },
      { type: DocumentType.LICENSE, buffer: licenseDoc.buffer },
    ]);
    res.status(201).json({ verification });
  },

  async getMine(req: Request, res: Response) {
    const verification = await verificationService.getMyVerification(req.user!.id);
    res.status(200).json({ verification });
  },

  async listPending(_req: Request, res: Response) {
    const pending = await verificationService.listPending();
    res.status(200).json({ pending });
  },

  async review(req: Request, res: Response) {
    const verification = await verificationService.review(
      req.params.id,
      req.body.status,
      req.user!.id,
    );
    res.status(200).json({ verification });
  },
};
