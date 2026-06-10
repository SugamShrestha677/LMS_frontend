import { resolveWebSocketBaseUrl } from '@/lib/config/runtime-urls';
import type { AppNotification, NotificationEnvelope } from './types';

export function buildNotificationSocketUrl(
  accessToken: string,
  baseUrl?: string,
): string {
  const origin = (baseUrl || resolveWebSocketBaseUrl()).trim();
  const websocketOrigin = origin.replace(/^http/i, 'ws');
  const params = new URLSearchParams({ token: accessToken });

  return `${websocketOrigin}/ws/notifications/?${params.toString()}`;
}

export function fingerprintNotification(payload: AppNotification): string {
  return [
    'notification',
    String(payload.id),
    payload.title,
    payload.message,
    payload.notification_type,
    payload.created_at,
  ].join(':');
}

export function normalizeNotificationPayload(
  raw: Record<string, unknown>,
): AppNotification | null {
  const id = Number(raw.id);
  if (!Number.isFinite(id)) {
    return null;
  }

  const title = typeof raw.title === 'string' ? raw.title : '';
  const message = typeof raw.message === 'string' ? raw.message : '';
  const notificationType =
    typeof raw.notification_type === 'string' ? raw.notification_type : 'general';

  return {
    id,
    title,
    message,
    notification_type: notificationType as AppNotification['notification_type'],
    link: typeof raw.link === 'string' ? raw.link : null,
    is_read: Boolean(raw.is_read),
    metadata:
      raw.metadata && typeof raw.metadata === 'object'
        ? (raw.metadata as Record<string, unknown>)
        : {},
    created_at:
      typeof raw.created_at === 'string'
        ? raw.created_at
        : new Date().toISOString(),
  };
}

export function normalizeNotificationEvent(
  payload: Record<string, unknown>,
  receivedAt = new Date().toISOString(),
): NotificationEnvelope | null {
  const normalized = normalizeNotificationPayload(payload);
  if (!normalized) {
    return null;
  }

  return {
    channel: 'notifications',
    fingerprint: fingerprintNotification(normalized),
    receivedAt,
    payload: normalized,
  };
}
