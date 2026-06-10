'use client';

import { create } from 'zustand';
import type { AppNotification, NotificationEnvelope, RealtimeConnectionState } from './types';
import { fingerprintNotification } from './notifications';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  connectionState: RealtimeConnectionState;
  lastEvent: NotificationEnvelope | null;
  error: string | null;
  hydrated: boolean;
  seenFingerprints: Set<string>;
  setConnectionState: (state: RealtimeConnectionState) => void;
  setError: (message: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
  hydrateFromApi: (notifications: AppNotification[], unreadCount?: number) => void;
  addNotification: (notification: AppNotification, source?: 'api' | 'realtime') => boolean;
  applyRealtimeEvent: (event: NotificationEnvelope) => boolean;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  reset: () => void;
}

function computeUnreadCount(notifications: AppNotification[]): number {
  return notifications.filter((n) => !n.is_read).length;
}

const initialState = {
  notifications: [] as AppNotification[],
  unreadCount: 0,
  connectionState: 'idle' as RealtimeConnectionState,
  lastEvent: null as NotificationEnvelope | null,
  error: null as string | null,
  hydrated: false,
  seenFingerprints: new Set<string>(),
};

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  ...initialState,
  setConnectionState: (connectionState) => set({ connectionState }),
  setError: (error) => set({ error }),
  setHydrated: (hydrated) => set({ hydrated }),
  hydrateFromApi: (notifications, unreadCount) => {
    const fingerprints = new Set<string>();
    notifications.forEach((n) => fingerprints.add(fingerprintNotification(n)));

    set({
      notifications,
      unreadCount: unreadCount ?? computeUnreadCount(notifications),
      hydrated: true,
      seenFingerprints: fingerprints,
      error: null,
    });
  },
  addNotification: (notification, source = 'realtime') => {
    const fingerprint = fingerprintNotification(notification);
    const { seenFingerprints, notifications } = get();

    if (seenFingerprints.has(fingerprint)) {
      return false;
    }

    const nextFingerprints = new Set(seenFingerprints);
    nextFingerprints.add(fingerprint);

    const existingIndex = notifications.findIndex((n) => n.id === notification.id);
    let nextNotifications: AppNotification[];

    if (existingIndex >= 0) {
      nextNotifications = [...notifications];
      nextNotifications[existingIndex] = notification;
    } else {
      nextNotifications = [notification, ...notifications];
    }

    set({
      notifications: nextNotifications,
      unreadCount: computeUnreadCount(nextNotifications),
      seenFingerprints: nextFingerprints,
      ...(source === 'realtime' ? { connectionState: 'open' as RealtimeConnectionState } : {}),
    });

    return true;
  },
  applyRealtimeEvent: (event) => {
    const isNew = get().addNotification(
      { ...event.payload, is_read: false },
      'realtime',
    );

    if (isNew) {
      set({ lastEvent: event, error: null });
    }

    return isNew;
  },
  markAsRead: (id) => {
    const notifications = get().notifications.map((n) =>
      n.id === id ? { ...n, is_read: true } : n,
    );
    set({
      notifications,
      unreadCount: computeUnreadCount(notifications),
    });
  },
  markAllAsRead: () => {
    const notifications = get().notifications.map((n) => ({ ...n, is_read: true }));
    set({
      notifications,
      unreadCount: 0,
    });
  },
  reset: () =>
    set({
      ...initialState,
      seenFingerprints: new Set<string>(),
    }),
}));
