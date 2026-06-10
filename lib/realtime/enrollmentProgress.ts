import type {
  EnrollmentProgressEnvelope,
  EnrollmentProgressMessage,
} from './types';
import { resolveWebSocketBaseUrl } from '@/lib/config/runtime-urls';

export function resolveWebSocketOrigin(baseUrl?: string): string {
  return baseUrl || resolveWebSocketBaseUrl();
}

export function buildEnrollmentProgressSocketUrl(
  enrollmentId: string | number,
  baseUrl?: string,
  accessToken?: string | null,
): string {
  const origin = resolveWebSocketOrigin(baseUrl);
  const websocketOrigin = origin.replace(/^http/i, 'ws');
  const path = `${websocketOrigin}/ws/enrollment/${encodeURIComponent(
    String(enrollmentId),
  )}/progress/`;

  if (accessToken) {
    const params = new URLSearchParams({ token: accessToken });
    return `${path}?${params.toString()}`;
  }

  return path;
}

export function clampProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return 0;
  }

  return Math.max(0, Math.min(100, progress));
}

export function normalizeEnrollmentProgressMessage(
  payload: Partial<EnrollmentProgressMessage>,
): EnrollmentProgressMessage {
  const progress = clampProgress(Number(payload.progress ?? 0));
  const status = typeof payload.status === 'string' ? payload.status : 'unknown';
  const score =
    payload.score === null || payload.score === undefined
      ? null
      : Number.isFinite(Number(payload.score))
        ? Number(payload.score)
        : null;

  return {
    progress,
    status,
    score,
  };
}

export function fingerprintEnrollmentProgressMessage(
  enrollmentId: string | number,
  payload: EnrollmentProgressMessage,
): string {
  const scoreToken = payload.score === null ? 'null' : String(payload.score);

  return [
    'enrollment_progress',
    String(enrollmentId),
    String(payload.progress),
    payload.status,
    scoreToken,
  ].join(':');
}

export function normalizeEnrollmentProgressEvent(
  enrollmentId: string | number,
  payload: Partial<EnrollmentProgressMessage>,
  receivedAt = new Date().toISOString(),
): EnrollmentProgressEnvelope {
  const normalizedPayload = normalizeEnrollmentProgressMessage(payload);

  return {
    channel: 'enrollment_progress',
    enrollmentId,
    fingerprint: fingerprintEnrollmentProgressMessage(
      enrollmentId,
      normalizedPayload,
    ),
    receivedAt,
    payload: normalizedPayload,
  };
}
