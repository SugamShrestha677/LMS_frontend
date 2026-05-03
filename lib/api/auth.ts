import api from './axios';
import { LoginInput, RegisterInput } from '../validations/auth';

export const authApi = {
  login: async (data: LoginInput) => {
    const response = await api.post('/auth/login/', data);
    return response.data;
  },

  register: async (data: RegisterInput) => {
    const response = await api.post('/auth/register/', data);
    return response.data;
  },

  verifyEmail: async (data: { email: string; otp: string }) => {
    const response = await api.post('/auth/verify-email/', data);
    return response.data;
  },

  resendOtp: async (email: string) => {
    const response = await api.post('/auth/resend-otp/', { email });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me/');
    return response.data;
  },

  refreshToken: async (refresh: string) => {
    const response = await api.post('/auth/token/refresh/', { refresh });
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout/');
    return response.data;
  },
};
