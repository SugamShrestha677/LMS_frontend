const LOCAL_API_URL = 'http://127.0.0.1:8000/api';
const PRODUCTION_API_URL = 'https://lms-backend-eff3.onrender.com/api';
const LOCAL_APP_URL = 'http://localhost:3000';
const PRODUCTION_APP_URL = 'https://skillbridge-eight-iota.vercel.app';

function isLocalHost(hostname: string): boolean {
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

function envOrDefault(key: string, fallback: string): string {
  const value = process.env[key]?.trim();
  return value || fallback;
}

export function resolveApiBaseUrl(fallback?: string): string {
  const envApi = envOrDefault('NEXT_PUBLIC_API_URL', '');

  if (typeof window !== 'undefined') {
    if (envApi) {
      return envApi;
    }
    return isLocalHost(window.location.hostname)
      ? LOCAL_API_URL
      : PRODUCTION_API_URL;
  }

  if (envApi) {
    return envApi;
  }

  return fallback ?? (process.env.NODE_ENV === 'development' ? LOCAL_API_URL : PRODUCTION_API_URL);
}

export function resolveAppBaseUrl(): string {
  const envApp = envOrDefault('NEXT_PUBLIC_APP_URL', '');

  if (typeof window !== 'undefined') {
    if (envApp) {
      return envApp;
    }
    return isLocalHost(window.location.hostname)
      ? LOCAL_APP_URL
      : PRODUCTION_APP_URL;
  }

  if (envApp) {
    return envApp;
  }

  return process.env.NODE_ENV === 'development' ? LOCAL_APP_URL : PRODUCTION_APP_URL;
}

export function resolveWebSocketBaseUrl(): string {
  const wsOverride = envOrDefault('NEXT_PUBLIC_WS_URL', '');
  if (wsOverride) {
    return wsOverride.replace(/\/$/, '');
  }

  const apiUrl = resolveApiBaseUrl();
  try {
    const parsed = new URL(
      apiUrl,
      typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8000',
    );
    return parsed.origin;
  } catch {
    return typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8000';
  }
}