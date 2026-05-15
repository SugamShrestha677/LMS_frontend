import api from './api';

export const courseService = {
  // Courses
  getCourses: async (includeDeleted = false) => {
    const url = includeDeleted ? '/courses/?include_deleted=true' : '/courses/';
    const { data } = await api.get(url);
    return data;
  },

  getCourse: async (id: number) => {
    const { data } = await api.get(`/courses/${id}/`);
    return data;
  },

  createCourse: async (courseData: any) => {
    const isFormData = typeof FormData !== 'undefined' && courseData instanceof FormData;
    const { data } = await api.post(
      '/courses/',
      courseData,
      isFormData ? { headers: { 'Content-Type': undefined } } : undefined,
    );
    return data;
  },

  updateCourse: async (id: number, courseData: any) => {
    const isFormData = typeof FormData !== 'undefined' && courseData instanceof FormData;
    const { data } = await api.patch(
      `/courses/${id}/`,
      courseData,
      isFormData ? { headers: { 'Content-Type': undefined } } : undefined,
    );
    return data;
  },

  deleteCourse: async (id: number) => {
    const { data } = await api.delete(`/courses/${id}/`);
    return data;
  },

  restoreCourse: async (id: number) => {
    const { data } = await api.post(`/courses/${id}/restore/`);
    return data;
  },

  publishCourse: async (id: number) => {
    const { data } = await api.post(`/courses/${id}/publish/`);
    return data;
  },

  archiveCourse: async (id: number) => {
    const { data } = await api.post(`/courses/${id}/archive/`);
    return data;
  },

  // Modules
  getModules: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/modules/`);
    return data;
  },

  createModule: async (courseId: number, moduleData: any) => {
    const { data } = await api.post(`/courses/${courseId}/modules/`, moduleData);
    return data;
  },

  updateModule: async (courseId: number, moduleId: number, moduleData: any) => {
    const { data } = await api.patch(`/courses/${courseId}/modules/${moduleId}/`, moduleData);
    return data;
  },

  deleteModule: async (courseId: number, moduleId: number) => {
    const { data } = await api.delete(`/courses/${courseId}/modules/${moduleId}/`);
    return data;
  },

  // Module Contents
  getModuleContents: async (courseId: number, moduleId: number) => {
    const { data } = await api.get(`/courses/${courseId}/modules/${moduleId}/contents/`);
    return data;
  },

  createModuleContent: async (courseId: number, moduleId: number, contentData: any) => {
    const { data } = await api.post(
      `/courses/${courseId}/modules/${moduleId}/contents/`,
      contentData
    );
    return data;
  },

  updateModuleContent: async (courseId: number, moduleId: number, contentId: number, contentData: any) => {
    const { data } = await api.patch(
      `/courses/${courseId}/modules/${moduleId}/contents/${contentId}/`,
      contentData
    );
    return data;
  },

  deleteModuleContent: async (courseId: number, moduleId: number, contentId: number) => {
    const { data } = await api.delete(
      `/courses/${courseId}/modules/${moduleId}/contents/${contentId}/`
    );
    return data;
  },

  uploadContentScorm: async (courseId: number, moduleId: number, contentId: number, formData: FormData) => {
    const { data } = await api.post(
      `/courses/${courseId}/modules/${moduleId}/contents/${contentId}/upload-to-scorm/`,
      formData,
      { headers: { 'Content-Type': undefined } }
    );
    return data;
  },

  getContentScormStatus: async (courseId: number, moduleId: number, contentId: number) => {
    const { data } = await api.get(
      `/courses/${courseId}/modules/${moduleId}/contents/${contentId}/scorm-status/`
    );
    return data;
  },

  launchContentScorm: async (courseId: number, moduleId: number, contentId: number) => {
    const { data } = await api.get(
      `/courses/${courseId}/modules/${moduleId}/contents/${contentId}/launch/`
    );
    return data;
  },

  // Announcements
  getAnnouncements: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/announcements/`);
    return data;
  },

createAnnouncement: async (courseId: number, announcementData: any) => {
    const { data } = await api.post(`/courses/${courseId}/announcements/`, {
      title: announcementData.title,
      content: announcementData.content,
    });
    return data;
},

  updateAnnouncement: async (courseId: number, announcementId: number, announcementData: any) => {
    const { data } = await api.patch(
      `/courses/${courseId}/announcements/${announcementId}/`,
      announcementData
    );
    return data;
  },

  deleteAnnouncement: async (courseId: number, announcementId: number) => {
    const { data } = await api.delete(`/courses/${courseId}/announcements/${announcementId}/`);
    return data;
  },

  // Assessments
  getAssessments: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/assessments/`);
    return data;
  },

  createAssessment: async (courseId: number, assessmentData: any) => {
    const { data } = await api.post(`/courses/${courseId}/assessments/`, assessmentData);
    return data;
  },

  updateAssessment: async (courseId: number, assessmentId: number, assessmentData: any) => {
    const { data } = await api.patch(
      `/courses/${courseId}/assessments/${assessmentId}/`,
      assessmentData
    );
    return data;
  },

  deleteAssessment: async (courseId: number, assessmentId: number) => {
    const { data } = await api.delete(`/courses/${courseId}/assessments/${assessmentId}/`);
    return data;
  },

  // Student Assessments
  getStudentAssessments: async () => {
    const { data } = await api.get('/student-assessments/');
    return data;
  },

  submitAssessment: async (assessmentData: any) => {
    const { data } = await api.post('/student-assessments/', assessmentData);
    return data;
  },

  // Resources
  getCourseResources: async (id: number) => {
    const { data } = await api.get(`/courses/${id}/resources/`);
    return data;
  },

  createCourseResource: async (courseId: number, formData: FormData) => {
    const { data } = await api.post(
      `/courses/${courseId}/resources/`,
      formData,
      { headers: { 'Content-Type': undefined } },
    );
    return data;
  },

  deleteCourseResource: async (courseId: number, resourceId: number) => {
    const { data } = await api.delete(`/courses/${courseId}/resources/${resourceId}/`);
    return data;
  },

  // Enrollments
  getEnrollments: async () => {
    const { data } = await api.get('/enrollments/');
    return data;
  },

  // Certificates
  getCertificates: async () => {
    const { data } = await api.get('/certificates/');
    return data;
  },

  generateCertificate: async (enrollmentId: number) => {
    const { data } = await api.post('/certificates/generate_certificate/', {
      enrollment_id: enrollmentId,
    });
    return data;
  },

  // Reviews
  getReviews: async (courseId: number) => {
    const { data } = await api.get(`/courses/${courseId}/reviews/`);
    return data;
  },

  createReview: async (courseId: number, reviewData: any) => {
    const { data } = await api.post(`/courses/${courseId}/reviews/`, reviewData);
    return data;
  },

  // Categories
  getCategories: async () => {
    const { data } = await api.get('/categories/');
    return data;
  },

  // SCORM
  uploadScorm: async (id: number, formData: FormData) => {
    const { data } = await api.post(
      `/courses/${id}/upload-scorm/`,
      formData,
      { headers: { 'Content-Type': undefined } },
    );
    return data;
  },

  getScormStatus: async (id: number) => {
    const { data } = await api.get(`/courses/${id}/scorm-status/`);
    return data;
  },

  getScormProgress: async (id: number) => {
    const { data } = await api.get(`/courses/${id}/scorm-progress/`);
    return data;
  },

  // Thumbnail & Preview Video
  uploadThumbnail: async (courseId: number, formData: FormData) => {
    const { data } = await api.post(
      `/courses/${courseId}/upload-thumbnail/`,
      formData,
      { headers: { 'Content-Type': undefined } },
    );
    return data;
  },

  uploadPreviewVideo: async (courseId: number, formData: FormData) => {
    const { data } = await api.post(
      `/courses/${courseId}/upload-preview-video/`,
      formData,
      { headers: { 'Content-Type': undefined } },
    );
    return data;
  },

  // Student specific
  getStudentCourses: async () => {
    const { data } = await api.get('/student/courses/');
    return data;
  },

  getStudentEnrolledCourses: async () => {
    const { data } = await api.get('/student/courses/enrolled/');
    return data;
  },

  getStudentCourseDetail: async (courseId: number) => {
    const { data } = await api.get(`/student/courses/${courseId}/`);
    return data;
  },

  enrollStudent: async (courseId: number) => {
    const { data } = await api.post(`/student/courses/${courseId}/enroll/`);
    return data;
  },

  getStudentDashboard: async () => {
    const { data } = await api.get('/student/dashboard/');
    return data;
  },
  // Add this method to courseService
createCourseResourceJson: async (courseId: number, data: any) => {
    const { data: response } = await api.post(`/courses/${courseId}/resources/`, data);
    return response;
},

  // Payments
  getPayments: async () => {
    const { data } = await api.get('/payments/');
    return data;
  },

  submitPayment: async (paymentData: any) => {
    const { data } = await api.post('/payments/', paymentData);
    return data;
  },

  confirmPayment: async (paymentId: number) => {
    const { data } = await api.post(`/payments/${paymentId}/confirm/`);
    return data;
  },

  rejectPayment: async (paymentId: number, reason: string) => {
    const { data } = await api.post(`/payments/${paymentId}/reject/`, { reason });
    return data;
  },
};