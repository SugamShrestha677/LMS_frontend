/**
 * Re-export from the canonical auth store so that all imports
 * (whether they use 'authStore' or 'auth-store') hit the same
 * Zustand store instance and the same persisted localStorage key.
 */
export { useAuthStore } from './auth-store';
export type { UserRole } from '@/lib/types/auth';
