/**
 * Verification service — business logic for identity verification (Iteration 3).
 *
 * Providers upload ID + license images; we store them in Cloudinary and record
 * them against the provider's profile with status PENDING. An admin later
 * approves or rejects. No HTTP/SQL concerns here.
 */
import { DocumentType, VerificationStatus } from '@prisma/client';
import { verificationRepository } from '../repositories/verification.repository';
import { uploadImage } from '../lib/cloudinary';
import { AppError } from '../lib/errors';

interface SubmitFile {
  type: DocumentType;
  buffer: Buffer;
}

export const verificationService = {
  async submitDocuments(userId: string, files: SubmitFile[]) {
    if (files.length === 0) {
      throw new AppError(400, 'Upload your ID and license documents');
    }

    const profile = await verificationRepository.ensureProfile(userId);

    for (const file of files) {
      const { url } = await uploadImage(file.buffer, 'homefixr/verification');
      await verificationRepository.addDocument(profile.id, file.type, url);
    }

    // Re-submitting moves the profile back to PENDING for review.
    await verificationRepository.setProfileStatus(profile.id, 'PENDING');
    return verificationRepository.getProfileByUserId(userId);
  },

  getMyVerification(userId: string) {
    return verificationRepository.getProfileByUserId(userId);
  },

  listPending() {
    return verificationRepository.listPending();
  },

  async review(providerProfileId: string, status: VerificationStatus, adminId: string) {
    const result = await verificationRepository.review(providerProfileId, status, adminId);
    if (!result) throw new AppError(404, 'Provider profile not found');
    return result;
  },
};
