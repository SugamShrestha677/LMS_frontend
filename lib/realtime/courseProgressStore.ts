'use client';

import { create } from 'zustand';
import type {
  CourseProgressSnapshot,
  EnrollmentProgressEnvelope,
  RealtimeConnectionState,
} from './types';

interface CourseProgressState extends CourseProgressSnapshot {
  connectionState: RealtimeConnectionState;
  lastEvent: EnrollmentProgressEnvelope | null;
  error: string | null;
  setEnrollmentId: (enrollmentId: string | number | null) => void;
  setConnectionState: (state: RealtimeConnectionState) => void;
  setError: (message: string | null) => void;
  applyEvent: (event: EnrollmentProgressEnvelope) => boolean;
  reset: () => void;
}

const snapshotDefaults: CourseProgressSnapshot = {
  enrollmentId: null,
  progress: null,
  status: null,
  score: null,
  fingerprint: null,
  receivedAt: null,
};

export const useCourseProgressStore = create<CourseProgressState>()((set, get) => ({
  ...snapshotDefaults,
  connectionState: 'idle',
  lastEvent: null,
  error: null,
  setEnrollmentId: (enrollmentId) =>
    set((state) => ({
      enrollmentId,
      ...(state.enrollmentId !== enrollmentId
        ? {
            ...snapshotDefaults,
            enrollmentId,
            connectionState: 'idle',
            lastEvent: null,
            error: null,
          }
        : {}),
    })),
  setConnectionState: (connectionState) => set({ connectionState }),
  setError: (error) => set({ error }),
  applyEvent: (event) => {
    if (get().fingerprint === event.fingerprint) {
      return false;
    }

    set({
      enrollmentId: event.enrollmentId,
      progress: event.payload.progress,
      status: event.payload.status,
      score: event.payload.score,
      fingerprint: event.fingerprint,
      receivedAt: event.receivedAt,
      lastEvent: event,
      error: null,
      connectionState: 'open',
    });

    return true;
  },
  reset: () =>
    set({
      ...snapshotDefaults,
      connectionState: 'idle',
      lastEvent: null,
      error: null,
    }),
}));
