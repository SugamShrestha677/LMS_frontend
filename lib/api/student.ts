import api from '@/lib/api/axios';

export const studentApi = {
  getDashboard: async () => {
    const res = await api.get('/student/dashboard/');
    return res.data;
  },

  getCourses: async () => {
    const res = await api.get('/student/courses/');
    return res.data;
  },

  getEnrolledCourses: async () => {
    const res = await api.get('/student/courses/enrolled/');
    return res.data;
  },

  enrollCourse: async (courseId: number) => {
    const res = await api.post(`/student/courses/${courseId}/enroll/`);
    return res.data;
  },

  getBadges: async () => {
    const res = await api.get('/student/badges/');
    return res.data;
  },

  getProfile: async () => {
    const res = await api.get('/student/profile/');
    return res.data;
  },

  updateProfile: async (data: FormData) => {
    const res = await api.patch('/student/profile/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getProgress: async () => {
    const res = await api.get('/student/progress/');
    return res.data;
  },

  getAssessments: async () => {
    const res = await api.get('/student/assessments/');
    return res.data;
  },

  submitAssessment: async (id: number, answers: Record<string, unknown>) => {
    const res = await api.post(`/assessments/${id}/submit/`, { answers });
    return res.data;
  },

  getJobs: async () => {
    const res = await api.get('/student/jobs/');
    return res.data;
  },

  applyJob: async (jobId: number) => {
    const res = await api.post(`/student/jobs/${jobId}/apply/`);
    return res.data;
  },

  getCertificates: async () => {
    const res = await api.get('/student/certificates/');
    return res.data;
  },
};
