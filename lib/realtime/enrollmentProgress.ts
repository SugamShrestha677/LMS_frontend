import type {
  EnrollmentProgressEnvelope,
  EnrollmentProgressMessage,
} from './types';
import { resolveApiBaseUrl } from '@/lib/config/runtime-urls';

const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || resolveApiBaseUrl();

export function resolveWebSocketOrigin(baseUrl?: string): string {
  const candidate = (baseUrl || DEFAULT_BASE_URL).trim();

  if (candidate) {
    const parsed = new URL(
      candidate,
      typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:8000',
    );
    return parsed.origin;
  }

  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  return 'http://127.0.0.1:8000';
}

export function buildEnrollmentProgressSocketUrl(
  enrollmentId: string | number,
  baseUrl?: string,
): string {
  const origin = resolveWebSocketOrigin(baseUrl);
  const websocketOrigin = origin.replace(/^http/i, 'ws');

  return `${websocketOrigin}/ws/enrollment/${encodeURIComponent(
    String(enrollmentId),
  )}/progress/`;
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
