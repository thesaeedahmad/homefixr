/**
 * Verification repository — data access for provider verification.
 *
 * Touches ProviderProfile and VerificationDocument (which are part of the same
 * feature). The review() method runs inside a transaction so the profile
 * status, the document statuses, and the user's isVerified flag always change
 * together (data consistency).
 */
import { VerificationStatus, DocumentType } from '@prisma/client';
import { prisma } from '../lib/prisma';

export const verificationRepository = {
  /** Returns the provider's profile, creating it on first use. */
  async ensureProfile(userId: string) {
    const existing = await prisma.providerProfile.findUnique({ where: { userId } });
    if (existing) return existing;
    return prisma.providerProfile.create({ data: { userId } });
  },

  getProfileByUserId(userId: string) {
    return prisma.providerProfile.findUnique({
      where: { userId },
      include: { documents: true },
    });
  },

  addDocument(providerProfileId: string, type: DocumentType, imageUrl: string) {
    return prisma.verificationDocument.create({
      data: { providerProfileId, type, imageUrl },
    });
  },

  setProfileStatus(id: string, status: VerificationStatus) {
    return prisma.providerProfile.update({
      where: { id },
      data: { verificationStatus: status },
    });
  },

  listPending() {
    return prisma.providerProfile.findMany({
      where: { verificationStatus: 'PENDING' },
      include: {
        documents: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { id: 'asc' },
    });
  },

  /** Approve/reject a profile and sync everything in one transaction. */
  async review(providerProfileId: string, status: VerificationStatus, adminId: string) {
    const profile = await prisma.providerProfile.findUnique({
      where: { id: providerProfileId },
    });
    if (!profile) return null;

    const isApproved = status === 'APPROVED';
    return prisma.$transaction(async (tx) => {
      const updated = await tx.providerProfile.update({
        where: { id: providerProfileId },
        data: { verificationStatus: status },
      });
      await tx.verificationDocument.updateMany({
        where: { providerProfileId },
        data: { status, reviewedByAdminId: adminId },
      });
      await tx.user.update({
        where: { id: profile.userId },
        data: { isVerified: isApproved },
      });
      return updated;
    });
  },
};
