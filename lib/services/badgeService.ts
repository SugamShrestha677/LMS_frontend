import api from '@/lib/api/axios';

export const badgeService = {
  getStudentBadges: async () => {
    const response = await api.get('/student/badges/');
    return response.data.data; 
  },
  
  getCourseAvailableBadges: async (courseId: number | string) => {
    const response = await api.get(`/courses/${courseId}/badges/`);
    return response.data.data;
  },
  
  verifyBadge: async (badgeId: number | string) => {
    const response = await api.get(`/verify/badge/${badgeId}/`);
    return response.data.data;
  }
};
