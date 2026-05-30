export type RealtimeConnectionState =
  | 'idle'
  | 'connecting'
  | 'open'
  | 'reconnecting'
  | 'closed'
  | 'error';

export interface EnrollmentProgressMessage {
  progress: number;
  status: string;
  score: number | null;
}

export interface EnrollmentProgressEnvelope {
  channel: 'enrollment_progress';
  enrollmentId: string | number;
  fingerprint: string;
  receivedAt: string;
  payload: EnrollmentProgressMessage;
}

export interface CourseProgressSnapshot {
  enrollmentId: string | number | null;
  progress: number | null;
  status: string | null;
  score: number | null;
  fingerprint: string | null;
  receivedAt: string | null;
}

export interface CourseProgressReconnectPolicy {
  enabled?: boolean;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  maxAttempts?: number;
}

export interface CreateCourseProgressClientOptions {
  enrollmentId: string | number;
  baseUrl?: string;
  reconnect?: CourseProgressReconnectPolicy;
  onStateChange?: (state: RealtimeConnectionState) => void;
  onEvent?: (event: EnrollmentProgressEnvelope) => void;
  onError?: (error: Error) => void;
}
