/**
 * Admin service — dashboard data for administrators.
 * Thin read-only wrappers over the admin repository.
 */
import { adminRepository } from '../repositories/admin.repository';

export const adminService = {
  overview() {
    return adminRepository.overview();
  },
  listUsers() {
    return adminRepository.listUsers();
  },
  listJobs() {
    return adminRepository.listJobs();
  },
};
