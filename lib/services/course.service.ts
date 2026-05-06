import api from './api';

export const courseService = {
  getCourses: async () => {
    const { data } = await api.get('/courses/');
    return data;
  },

  getCourse: async (id: number) => {
    const { data } = await api.get(`/courses/${id}/`);
    return data;
  },

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
    const { data } = await api.patch(`/courses/${id}/`, courseData);
    return data;
  },

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

  deleteCourse: async (id: number) => {
    const { data } = await api.delete(`/courses/${id}/`);
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

  getEnrollments: async () => {
    const { data } = await api.get('/enrollments/');
    return data;
  },

  getCertificates: async () => {
    const { data } = await api.get('/certificates/');
    return data;
  },

  getCategories: async () => {
    const { data } = await api.get('/categories/');
    return data;
  },
};
