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
  accessToken?: string | null;
  reconnect?: CourseProgressReconnectPolicy;
  onStateChange?: (state: RealtimeConnectionState) => void;
  onEvent?: (event: EnrollmentProgressEnvelope) => void;
  onError?: (error: Error) => void;
}

export type NotificationType =
  | 'course_enrollment'
  | 'course_completion'
  | 'assignment_graded'
  | 'quiz_graded'
  | 'system_alert'
  | 'message'
  | 'attendance_alert'
  | 'certificate_available'
  | 'general';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  notification_type: NotificationType;
  link: string | null;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface NotificationEnvelope {
  channel: 'notifications';
  fingerprint: string;
  receivedAt: string;
  payload: AppNotification;
}

export interface NotificationReconnectPolicy {
  enabled?: boolean;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffFactor?: number;
  maxAttempts?: number;
}

export interface CreateNotificationClientOptions {
  accessToken: string;
  baseUrl?: string;
  reconnect?: NotificationReconnectPolicy;
  onStateChange?: (state: RealtimeConnectionState) => void;
  onEvent?: (event: NotificationEnvelope) => void;
  onError?: (error: Error) => void;
}
