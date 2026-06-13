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

  getCourseResources: async (courseId: number) => {
    const res = await api.get(`/courses/${courseId}/resources/`);
    return unwrapResponse(res.data);
  },

  enrollCourse: async (courseId: number) => {
    const res = await api.post(`/student/courses/${courseId}/enroll/`);
    return unwrapResponse(res.data);
  },

  completeContent: async (enrollmentId: number, contentId: number) => {
    const res = await api.post(`/enrollments/${enrollmentId}/complete_content/`, {
      content_id: contentId,
    });
    return unwrapResponse(res.data);
  },

  getScormProgress: async (courseId: number) => {
    const res = await api.get(`/courses/${courseId}/scorm-progress/`);
    return unwrapResponse(res.data);
  },

  getBadges: async () => {
    const res = await api.get('/student/badges/');
    return unwrapResponse(res.data);
  },

  // ─── Profile (uses /accounts/users/me/) ─────────────────────
  getProfile: async () => {
    const res = await api.get('/accounts/users/me/');
    return unwrapResponse(res.data);
  },

  updateProfile: async (data: Record<string, unknown>) => {
    const res = await api.patch('/accounts/users/me/', data);
    return unwrapResponse(res.data);
  },

  // ─── Avatar upload (Cloudinary) ─────────────────────────────
  uploadAvatar: async (file: File) => {
    const fd = new FormData();
    fd.append('image', file);
    const res = await api.post('/accounts/upload-profile-picture/', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return unwrapResponse(res.data);
  },

  // ─── Password change ───────────────────────────────────────
  changePassword: async (data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) => {
    const res = await api.post('/accounts/auth/change-password', data);
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
  getAnnouncements: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/announcements/`);
    return data;
  },
  sendHeartbeat: async (enrollmentId: number, data: { content_id: number; current_time: number; duration: number }) => {
    const res = await api.post(`/enrollments/${enrollmentId}/heartbeat/`, data);
    return unwrapResponse(res.data);
  },
  getAttendance: async () => {
    const res = await api.get('/student/attendance/');
    return unwrapResponse(res.data);
  },
};

