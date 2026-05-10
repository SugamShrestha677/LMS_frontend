import api from "./api";
import { LoginInput, LoginResponse, FirstLoginInput } from "@/lib/types/auth";
import { useAuthStore } from "@/lib/store/auth-store";

export const authService = {
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/accounts/auth/login",
      data,
    );
    return response.data;
  },

  async firstLogin(data: FirstLoginInput): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/accounts/auth/first-login",
      data,
    );
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/accounts/users/me");
    return response.data;
  },

  async getCurrentUser() {
    return this.getProfile();
  },

  async updateProfile(data: any) {
    const response = await api.patch("/accounts/users/me", data);
    return response.data;
  },

  async changePassword(data: {
    old_password: string;
    new_password: string;
    confirm_password: string;
  }) {
    const response = await api.post("/accounts/auth/change-password", data);
    return response.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post("/accounts/auth/forgot-password", {
      email,
    });
    return response.data;
  },

  async resetPassword(data: {
    token: string;
    new_password: string;
    confirm_password: string;
  }) {
    const response = await api.post("/accounts/auth/reset-password", data);
    return response.data;
  },

  async verifyEmail(data: { email: string; otp: string }) {
    const response = await api.post(
      "/accounts/auth/verify-email",
      data,
    );
    return response.data;
  },

  async resendOtp(data: { email: string }) {
    const response = await api.post(
      "/accounts/auth/resend-otp",
      data,
    );
    return response.data;
  },

  async logout(refreshToken: string) {
    const response = await api.post("/accounts/auth/logout", {
      refresh: refreshToken,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string) {
    const response = await api.post("/accounts/auth/token/refresh", {
      refresh: refreshToken,
    });

    const data = response.data;
    const newAccess = data.access;
    const newRefresh = data.refresh ?? refreshToken;

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", newAccess);
      localStorage.setItem("refresh_token", newRefresh);
    }

    // update api default header
    api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

    // update zustand store if available
    try {
      const store = useAuthStore.getState();
      if (store?.setAccessToken) store.setAccessToken(newAccess);
      if (store?.setRefreshToken) store.setRefreshToken(newRefresh);
    } catch (e) {
      // ignore
    }

    return data;
  },

  async getUsers() {
    const response = await api.get("/accounts/users");
    return response.data;
  },

  async createUser(data: {
    email: string;
    personal_email: string;
    role: string;
  }) {
    const response = await api.post("/accounts/auth/users/create-user", data);
    return response.data;
  },

  async register(data: any) {
    const response = await api.post("/accounts/auth/register", data);
    return response.data;
  },

  async updateUser(id: string | number, data: any) {
    const response = await api.patch(`/accounts/users/${id}/`, data);
    return response.data;
  },

  async changeRole(id: string | number, role: string) {
    const response = await api.post(`/accounts/users/${id}/change-role/`, { role });
    return response.data;
  },

  async softDelete(id: string | number, reason: string) {
    const response = await api.post(`/accounts/users/${id}/soft-delete/`, { reason });
    return response.data;
  },
};
