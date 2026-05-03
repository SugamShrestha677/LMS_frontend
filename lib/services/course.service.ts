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

  createCourse: async (courseData: any) => {
    const { data } = await api.post('/courses/', courseData);
    return data;
  },

  updateCourse: async (id: number, courseData: any) => {
    const { data } = await api.patch(`/courses/${id}/`, courseData);
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
};
