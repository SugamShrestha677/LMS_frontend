import api from '@/lib/api/axios';

export const companyApi = {
  getDashboard: async () => {
    const res = await api.get('/company/dashboard/');
    return res.data;
  },

  getTalentPool: async (filters?: Record<string, string | number>) => {
    const res = await api.get('/company/talent-pool/', { params: filters });
    return res.data;
  },

  getCandidate: async (id: number) => {
    const res = await api.get(`/company/candidates/${id}/`);
    return res.data;
  },

  shortlistCandidate: async (candidateId: number) => {
    const res = await api.post(`/company/candidates/${candidateId}/shortlist/`);
    return res.data;
  },

  removeShortlist: async (candidateId: number) => {
    const res = await api.delete(`/company/candidates/${candidateId}/shortlist/`);
    return res.data;
  },

  getShortlisted: async () => {
    const res = await api.get('/company/shortlisted/');
    return res.data;
  },

  getJobs: async () => {
    const res = await api.get('/company/jobs/');
    return res.data;
  },

  postJob: async (data: Record<string, unknown>) => {
    const res = await api.post('/company/jobs/', data);
    return res.data;
  },

  updateJob: async (id: number, data: Record<string, unknown>) => {
    const res = await api.patch(`/company/jobs/${id}/`, data);
    return res.data;
  },

  deleteJob: async (id: number) => {
    const res = await api.delete(`/company/jobs/${id}/`);
    return res.data;
  },

  scheduleInterview: async (data: Record<string, unknown>) => {
    const res = await api.post('/company/interviews/', data);
    return res.data;
  },

  getInterviews: async () => {
    const res = await api.get('/company/interviews/');
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/company/profile/');
    return res.data;
  },

  updateProfile: async (data: FormData) => {
    const res = await api.patch('/company/profile/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
