'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/lib/store/auth-store';
import { createNotificationClient } from '@/lib/realtime/notificationClient';
import { useNotificationStore } from '@/lib/realtime/notificationStore';
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/services/notification.service';

let globalClient: ReturnType<typeof createNotificationClient> | null = null;
let lastToastedFingerprint: string | null = null;

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const _hasHydrated = useAuthStore((s) => s._hasHydrated);

  const applyRealtimeEvent = useNotificationStore((s) => s.applyRealtimeEvent);
  const hydrateFromApi = useNotificationStore((s) => s.hydrateFromApi);
  const setConnectionState = useNotificationStore((s) => s.setConnectionState);
  const setError = useNotificationStore((s) => s.setError);
  const reset = useNotificationStore((s) => s.reset);

  const hydratedRef = useRef(false);
  const lastTokenRef = useRef<string | null>(null);

  useEffect(() => {
    if (!_hasHydrated) {
      return;
    }

    if (!isAuthenticated || !accessToken) {
      globalClient?.close();
      globalClient = null;
      lastTokenRef.current = null;
      reset();
      hydratedRef.current = false;
      return;
    }

    const loadHistory = async () => {
      try {
        const { notifications, unreadCount } = await fetchNotifications();
        hydrateFromApi(notifications, unreadCount);
        hydratedRef.current = true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Failed to load notifications';
        setError(message);
      }
    };

    if (!hydratedRef.current) {
      void loadHistory();
    }

    if (!globalClient) {
      globalClient = createNotificationClient({
        accessToken,
        onStateChange: setConnectionState,
        onEvent: (event) => {
          const isNew = applyRealtimeEvent(event);
          if (!isNew || event.fingerprint === lastToastedFingerprint) {
            return;
          }

          lastToastedFingerprint = event.fingerprint;
          toast.info(event.payload.title, {
            description: event.payload.message,
            duration: 5000,
          });
        },
        onError: (error) => setError(error.message),
      });
      lastTokenRef.current = accessToken;
      void globalClient.connect();
    } else if (lastTokenRef.current !== accessToken) {
      lastTokenRef.current = accessToken;
      globalClient.updateToken(accessToken);
    }
  }, [
    _hasHydrated,
    isAuthenticated,
    accessToken,
    applyRealtimeEvent,
    hydrateFromApi,
    setConnectionState,
    setError,
    reset,
  ]);

  return <>{children}</>;
}

export async function handleMarkNotificationRead(id: number): Promise<void> {
  const store = useNotificationStore.getState();
  store.markAsRead(id);
  try {
    const unreadCount = await markNotificationRead(id);
    useNotificationStore.setState({ unreadCount });
  } catch {
    // Optimistic update already applied
  }
}

export async function handleMarkAllNotificationsRead(): Promise<void> {
  const store = useNotificationStore.getState();
  store.markAllAsRead();
  try {
    await markAllNotificationsRead();
  } catch {
    // Optimistic update already applied
  }
}
