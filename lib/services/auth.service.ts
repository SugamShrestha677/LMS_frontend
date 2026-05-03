import api from './api';
import { LoginInput, LoginResponse, FirstLoginInput } from '@/lib/types/auth';

export const authService = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/accounts/auth/login', data);
    return response.data;
  },

  async firstLogin(data: FirstLoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/accounts/auth/first-login', data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/accounts/users/me');
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.patch('/accounts/users/me', data);
    return response.data;
  },

  async changePassword(data: { old_password: string; new_password: string; confirm_password: string }) {
    const response = await api.post('/accounts/auth/change-password', data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post('/accounts/auth/forgot-password', { email });
    return response.data;
  },

  async resetPassword(data: { token: string; new_password: string; confirm_password: string }) {
    const response = await api.post('/accounts/auth/reset-password', data);
    return response.data;
  },

  async logout(refreshToken: string) {
    const response = await api.post('/accounts/auth/logout', { refresh: refreshToken });
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post('/accounts/auth/token/refresh', { refresh: refreshToken });
    return response.data;
  },

  async getUsers() {
    const response = await api.get('/accounts/users');
    return response.data;
  },

  async createUser(data: { email: string; personal_email: string; role: string }) {
    const response = await api.post('/accounts/auth/users/create-user', data);
    return response.data;
  },
};