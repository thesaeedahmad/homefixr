/**
 * User service — business logic for profiles & settings (Iteration 2).
 *
 * Like the auth service, it knows nothing about HTTP or SQL. It returns a
 * "public" view of the user (never the password hash) and enforces the rule
 * that a password change requires the correct current password.
 */
import { User } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import { hashPassword, verifyPassword } from '../lib/password';
import { AppError } from '../lib/errors';
import { UpdateProfileInput, ChangePasswordInput } from '../schemas/user.schema';

/** Public profile shape returned to clients (excludes passwordHash). */
function toPublicProfile(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    location: user.location,
    avatarUrl: user.avatarUrl,
    isVerified: user.isVerified,
  };
}

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'User not found');
    return toPublicProfile(user);
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const updated = await userRepository.update(userId, input);
    return toPublicProfile(updated);
  },

  async changePassword(userId: string, input: ChangePasswordInput) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError(404, 'User not found');

    const currentOk = await verifyPassword(input.currentPassword, user.passwordHash);
    if (!currentOk) throw new AppError(401, 'Current password is incorrect');

    const newHash = await hashPassword(input.newPassword);
    await userRepository.updatePassword(userId, newHash);
    return { success: true };
  },
};
