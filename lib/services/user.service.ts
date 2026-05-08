// lib/services/user.service.ts
import api from './api';
import { User, AuditLog } from '@/lib/types/auth';

export const userService = {
  getUsers: async () => {
    const { data } = await api.get('/accounts/users/');
    return data;
  },

  getUser: async (id: number) => {
    const { data } = await api.get(`/accounts/users/${id}/`);
    return data;
  },

  createUser: async (userData: { email: string; personal_email: string; role: string }) => {
    const { data } = await api.post('/accounts/users/create/', userData);
    return data;
  },

  updateUser: async (id: number, userData: Partial<User>) => {
    const { data } = await api.patch(`/accounts/users/${id}/`, userData);
    return data;
  },

  changeRole: async (id: number, role: string) => {
    const { data } = await api.post(`/accounts/users/${id}/change-role/`, { role });
    return data;
  },

  deleteUser: async (id: number) => {
    const { data } = await api.delete(`/accounts/users/${id}/`);
    return data;
  },

  // Soft delete a user
  softDeleteUser: async (id: number, reason?: string) => {
    const { data } = await api.post(`/accounts/users/${id}/soft-delete/`, { reason });
    return data;
  },

  // Restore a soft-deleted user
  restoreUser: async (id: number) => {
    const { data } = await api.post(`/accounts/users/${id}/restore/`);
    return data;
  },

  activateUser: async (id: number) => {
    const { data } = await api.post(`/accounts/users/${id}/activate/`);
    return data;
  },

  deactivateUser: async (id: number) => {
    const { data } = await api.post(`/accounts/users/${id}/deactivate/`);
    return data;
  },

  getAuditLogs: async () => {
    const { data } = await api.get('/accounts/audit-logs/');
    return data;
  },

  getStaffPermissionByStaffId: async (staffId: number) => {
    const { data } = await api.get(`/accounts/staff-permissions/${staffId}/`);
    return data;
  },

  updateStaffPermission: async (id: number, permissionData: any) => {
    const { data } = await api.patch(`/accounts/staff-permissions/${id}/`, permissionData);
    return data;
  },
};
 