import api from '@/lib/api/axios';

export const adminApi = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard/');
    return res.data;
  },

  getUsers: async (params?: Record<string, string | number>) => {
    const res = await api.get('/admin/users/', { params });
    return res.data;
  },

  createUser: async (data: Record<string, unknown>) => {
    const res = await api.post('/admin/users/', data);
    return res.data;
  },

  updateUser: async (id: number, data: Record<string, unknown>) => {
    const res = await api.patch(`/admin/users/${id}/`, data);
    return res.data;
  },

  deleteUser: async (id: number) => {
    const res = await api.delete(`/admin/users/${id}/`);
    return res.data;
  },

  getCompanies: async () => {
    const res = await api.get('/admin/companies/');
    return res.data;
  },

  approveCompany: async (id: number) => {
    const res = await api.post(`/admin/companies/${id}/approve/`);
    return res.data;
  },

  getCourses: async () => {
    const res = await api.get('/admin/courses/');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/admin/analytics/');
    return res.data;
  },

  getAlerts: async () => {
    const res = await api.get('/admin/alerts/');
    return res.data;
  },

  grantPermission: async (userId: number, permission: string) => {
    const res = await api.post(`/admin/users/${userId}/permissions/`, { permission });
    return res.data;
  },

  getAuditLogs: async (params?: Record<string, string | number>) => {
    const res = await api.get('/admin/audit-logs/', { params });
    return res.data;
  },
};
