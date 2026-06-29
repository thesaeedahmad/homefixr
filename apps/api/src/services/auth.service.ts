/**
 * Authentication service — the business logic for registering and logging in.
 *
 * This layer knows nothing about HTTP (no req/res) and nothing about SQL (it
 * uses the repository). It enforces the rules:
 *  - emails are unique (no duplicate accounts)
 *  - passwords are hashed before storage, never returned
 *  - login reveals the SAME message whether the email is unknown or the
 *    password is wrong (so attackers can't discover which emails exist)
 */
import { User } from '@prisma/client';
import { userRepository } from '../repositories/user.repository';
import { hashPassword, verifyPassword } from '../lib/password';
import { signToken } from '../lib/jwt';
import { fraudService } from './fraud.service';
import { AppError } from '../lib/errors';
import { RegisterInput, LoginInput } from '../schemas/auth.schema';

/** Shape returned to clients — deliberately excludes passwordHash. */
function toPublicUser(user: User) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError(409, 'An account with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    // Rule-based fraud screen for possible duplicate accounts (non-blocking).
    await fraudService.checkRegistration(user.id, user.name);

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  },

  async login(input: LoginInput) {
    const user = await userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const passwordOk = await verifyPassword(input.password, user.passwordHash);
    if (!passwordOk) {
      throw new AppError(401, 'Invalid email or password');
    }

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: toPublicUser(user) };
  },

  async getProfile(userId: string) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return toPublicUser(user);
  },
};
