'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  buildEnrollmentProgressSocketUrl,
  createCourseProgressClient,
  useCourseProgressStore,
} from '@/lib/realtime';
import { useAuthStore } from '@/lib/store/auth-store';

type UseEnrollmentProgressResult = {
  progress: number | null;
  status: string | null;
  score: number | null;
  connectionState: 'idle' | 'connecting' | 'open' | 'reconnecting' | 'closed' | 'error';
  lastUpdatedAt: string | null;
};

export function useEnrollmentProgress(enrollmentId: string, enabled = true): UseEnrollmentProgressResult {
  const accessToken = useAuthStore((state) => state.accessToken);
  const progress = useCourseProgressStore((state) => state.progress);
  const status = useCourseProgressStore((state) => state.status);
  const score = useCourseProgressStore((state) => state.score);
  const connectionState = useCourseProgressStore((state) => state.connectionState);
  const receivedAt = useCourseProgressStore((state) => state.receivedAt);

  const setEnrollmentId = useCourseProgressStore((state) => state.setEnrollmentId);
  const setConnectionState = useCourseProgressStore((state) => state.setConnectionState);
  const setError = useCourseProgressStore((state) => state.setError);
  const applyEvent = useCourseProgressStore((state) => state.applyEvent);
  const reset = useCourseProgressStore((state) => state.reset);

  const replayWindowRef = useRef<{
    active: boolean;
    count: number;
    timeout: ReturnType<typeof setTimeout> | null;
  }>({
    active: false,
    count: 0,
    timeout: null,
  });

  const previousConnectionRef = useRef<typeof connectionState>('idle');

  const channelUrl = useMemo(
    () =>
      enrollmentId
        ? buildEnrollmentProgressSocketUrl(enrollmentId, undefined, accessToken)
        : '',
    [enrollmentId, accessToken],
  );

  useEffect(() => {
    if (!enabled || !enrollmentId) {
      reset();
      return;
    }

    const replayWindow = replayWindowRef.current;

    setEnrollmentId(enrollmentId);

    const client = createCourseProgressClient({
      enrollmentId,
      accessToken,
      onStateChange: (state) => {
        setConnectionState(state);

        const previous = previousConnectionRef.current;
        previousConnectionRef.current = state;

        if (process.env.NODE_ENV !== 'production' && state === 'open') {
          console.log(`[WebSocket] connected to channel ${channelUrl}`);
        }

        if (previous === 'reconnecting' && state === 'open') {
          replayWindow.active = true;
          replayWindow.count = 0;

          if (replayWindow.timeout) {
            clearTimeout(replayWindow.timeout);
          }

          replayWindow.timeout = setTimeout(() => {
            if (process.env.NODE_ENV !== 'production') {
              console.log(`[Replay] processed ${replayWindow.count} missed events`);
            }
            replayWindow.active = false;
            replayWindow.timeout = null;
          }, 5000);
        }
      },
      onEvent: (event) => {
        if (process.env.NODE_ENV !== 'production') {
          console.log(`[WebSocket] received event id: ${event.fingerprint}`);
        }

        const applied = applyEvent(event);
        if (!applied) {
          if (process.env.NODE_ENV !== 'production') {
            console.log(`[Dedupe] skipped duplicate event ${event.fingerprint}`);
          }
          return;
        }

        if (replayWindow.active) {
          replayWindow.count += 1;
        }
      },
      onError: (error) => {
        setError(error.message);
      },
    });

    void client.connect();

    return () => {
      if (replayWindow.timeout) {
        clearTimeout(replayWindow.timeout);
        replayWindow.timeout = null;
      }
      replayWindow.active = false;
      replayWindow.count = 0;
      client.close();
    };
  }, [
    enabled,
    enrollmentId,
    accessToken,
    setEnrollmentId,
    setConnectionState,
    setError,
    applyEvent,
    reset,
    channelUrl,
  ]);

  return {
    progress,
    status,
    score,
    connectionState,
    lastUpdatedAt: receivedAt,
  };
}
