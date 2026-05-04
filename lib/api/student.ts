import api from '@/lib/api/axios';

function unwrapResponse<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export const studentApi = {
  getDashboard: async () => {
    const res = await api.get('/student/dashboard/');
    return unwrapResponse(res.data);
  },

  getCourses: async () => {
    const res = await api.get('/student/courses/');
    return unwrapResponse(res.data);
  },

  getEnrolledCourses: async () => {
    const res = await api.get('/student/courses/enrolled/');
    return unwrapResponse(res.data);
  },

  getCourse: async (courseId: number) => {
    const res = await api.get(`/student/courses/${courseId}/`);
    return unwrapResponse(res.data);
  },

  enrollCourse: async (courseId: number) => {
    const res = await api.post(`/student/courses/${courseId}/enroll/`);
    return unwrapResponse(res.data);
  },

  getBadges: async () => {
    const res = await api.get('/student/badges/');
    return unwrapResponse(res.data);
  },

  getProfile: async () => {
    const res = await api.get('/student/profile/');
    return unwrapResponse(res.data);
  },

  updateProfile: async (data: FormData) => {
    const res = await api.patch('/student/profile/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapResponse(res.data);
  },

  getProgress: async () => {
    const res = await api.get('/student/progress/');
    return unwrapResponse(res.data);
  },

  getAssessments: async () => {
    const res = await api.get('/student/assessments/');
    return unwrapResponse(res.data);
  },

  submitAssessment: async (id: number, answers: Record<string, unknown>) => {
    const res = await api.post(`/assessments/${id}/submit/`, { answers });
    return unwrapResponse(res.data);
  },

  getJobs: async () => {
    const res = await api.get('/student/jobs/');
    return unwrapResponse(res.data);
  },

  applyJob: async (jobId: number) => {
    const res = await api.post(`/student/jobs/${jobId}/apply/`);
    return unwrapResponse(res.data);
  },

  getCertificates: async () => {
    const res = await api.get('/student/certificates/');
    return unwrapResponse(res.data);
  },
};
