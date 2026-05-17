import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/lib/store/auth-store';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// ── Token refresh queue ───────────────────────────────────────────────────────
// If multiple requests fail simultaneously with 401, we queue them all and
// resolve/reject them once the single refresh call completes. This prevents
// multiple redundant refresh calls and avoids any visible UI flicker.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token as string);
  });
  failedQueue = [];
}

// ── Request interceptor — attach access token ─────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — silent token refresh on 401 ────────────────────────
api.interceptors.response.use(
  (response) => {
    // Globally unwrap the 'data' field from api_success responses
    if (response.data && typeof response.data === 'object' && 'success' in response.data && 'data' in response.data) {
      return {
        ...response,
        data: response.data.data
      };
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const { refreshToken, logout, setAccessToken } = useAuthStore.getState();

    // Only intercept 401s on requests that haven't already been retried
    // and that are NOT the refresh endpoint or the login endpoint itself
    const isRefreshEndpoint = originalRequest?.url?.includes('/accounts/auth/token/refresh');
    const isLoginEndpoint = originalRequest?.url?.includes('/accounts/auth/login');
    const isFirstLoginEndpoint = originalRequest?.url?.includes('/accounts/auth/first-login');

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !isRefreshEndpoint &&
      !isLoginEndpoint &&
      !isFirstLoginEndpoint
    ) {
      if (isRefreshing) {
        // Queue this request until the in-flight refresh completes
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      if (!refreshToken) {
        // No refresh token — log out immediately
        logout();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint directly (not through `api` to avoid loops)
        const { data } = await axios.post(
          `${API_URL}/accounts/auth/token/refresh`,
          { refresh: refreshToken },
        );
        const newAccessToken: string = data.access;

        // Persist the new token silently — no UI change visible
        setAccessToken(newAccessToken);

        // Flush the queue — all waiting requests get the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed — clear auth state and redirect to login
        processQueue(refreshError, null);
        logout();
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;