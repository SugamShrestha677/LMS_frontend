const LOCAL_API_URL = 'http://127.0.0.1:8000/api';
const PRODUCTION_API_URL = 'https://lms-backend-eff3.onrender.com/api';
const LOCAL_APP_URL = 'http://localhost:3000';
const PRODUCTION_APP_URL = 'https://skillbridge-eight-iota.vercel.app';

function isLocalHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

export function resolveApiBaseUrl(fallback?: string): string {
  if (typeof window !== 'undefined') {
    return isLocalHost(window.location.hostname)
      ? LOCAL_API_URL
      : PRODUCTION_API_URL;
  }

  return fallback ?? (process.env.NODE_ENV === 'development' ? LOCAL_API_URL : PRODUCTION_API_URL);
}

export function resolveAppBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return isLocalHost(window.location.hostname)
      ? LOCAL_APP_URL
      : PRODUCTION_APP_URL;
  }

  return process.env.NODE_ENV === 'development' ? LOCAL_APP_URL : PRODUCTION_APP_URL;
}