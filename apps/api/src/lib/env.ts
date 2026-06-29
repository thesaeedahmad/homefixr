/**
 * Centralised application configuration.
 *
 * The rest of the codebase imports from here instead of reading `process.env`
 * directly. This keeps configuration in ONE place (DRY) and gives us typed,
 * validated values with sensible defaults for local development.
 */
import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV ?? 'development',
  webOrigin: process.env.WEB_ORIGIN ?? 'http://localhost:3000',

  // Authentication (Iteration 1). The fallback secret is for LOCAL DEV ONLY —
  // production must set a strong JWT_SECRET in the environment.
  jwtSecret: process.env.JWT_SECRET ?? 'dev-insecure-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',

  // Cloudinary media storage (Iteration 3). Values come from .env only.
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },

  // Admin seed account (used by the seed script only).
  admin: {
    email: process.env.ADMIN_EMAIL ?? 'admin@homefixr.local',
    password: process.env.ADMIN_PASSWORD ?? 'admin12345',
    name: process.env.ADMIN_NAME ?? 'HomeFixr Admin',
  },

  // AI microservice (Iteration 6). The API calls it for price recommendations.
  aiServiceUrl: process.env.AI_SERVICE_URL ?? 'http://localhost:8000',
};
