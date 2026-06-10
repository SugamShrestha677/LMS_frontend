'use client';

import {
  buildNotificationSocketUrl,
  normalizeNotificationEvent,
} from './notifications';
import { resolveWebSocketBaseUrl } from '@/lib/config/runtime-urls';
import type {
  CreateNotificationClientOptions,
  RealtimeConnectionState,
} from './types';

function getWebSocketText(data: unknown): Promise<string | null> {
  if (typeof data === 'string') {
    return Promise.resolve(data);
  }

  if (data instanceof Blob) {
    return data.text();
  }

  if (data instanceof ArrayBuffer) {
    return Promise.resolve(new TextDecoder().decode(data));
  }

  if (ArrayBuffer.isView(data)) {
    return Promise.resolve(
      new TextDecoder().decode(
        data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
      ),
    );
  }

  return Promise.resolve(null);
}

export function createNotificationClient(options: CreateNotificationClientOptions) {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectAttempt = 0;
  let shouldReconnect = true;
  let hasOpenedOnce = false;

  const policy = {
    enabled: options.reconnect?.enabled ?? true,
    initialDelayMs: options.reconnect?.initialDelayMs ?? 500,
    maxDelayMs: options.reconnect?.maxDelayMs ?? 30000,
    backoffFactor: options.reconnect?.backoffFactor ?? 1.8,
    maxAttempts: options.reconnect?.maxAttempts ?? 12,
  };

  const emitState = (state: RealtimeConnectionState) => {
    options.onStateChange?.(state);
  };

  const clearReconnectTimer = () => {
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
  };

  const scheduleReconnect = () => {
    if (!shouldReconnect || !policy.enabled) {
      emitState('closed');
      return;
    }

    if (reconnectAttempt >= policy.maxAttempts) {
      emitState('error');
      options.onError?.(new Error('Notification WebSocket reconnect attempts exhausted'));
      return;
    }

    const delay = Math.min(
      policy.initialDelayMs * policy.backoffFactor ** reconnectAttempt,
      policy.maxDelayMs,
    );

    reconnectAttempt += 1;
    emitState('reconnecting');
    reconnectTimer = setTimeout(() => {
      void connect();
    }, delay);
  };

  const handleMessage = async (data: unknown) => {
    const text = await getWebSocketText(data);
    if (!text) {
      return;
    }

    try {
      const parsed = JSON.parse(text) as Record<string, unknown>;
      const event = normalizeNotificationEvent(parsed);
      if (!event) {
        return;
      }
      options.onEvent?.(event);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to parse notification payload';
      options.onError?.(new Error(message));
    }
  };

  async function connect() {
    if (typeof WebSocket === 'undefined') {
      throw new Error('WebSocket is not available in this environment');
    }

    if (!options.accessToken) {
      throw new Error('Access token is required for notification WebSocket');
    }

    const url = buildNotificationSocketUrl(
      options.accessToken,
      options.baseUrl || resolveWebSocketBaseUrl(),
    );

    clearReconnectTimer();
    emitState('connecting');

    socket = new WebSocket(url);
    socket.addEventListener('open', () => {
      hasOpenedOnce = true;
      reconnectAttempt = 0;
      emitState('open');
    });
    socket.addEventListener('message', (event) => {
      void handleMessage(event.data);
    });
    socket.addEventListener('error', () => {
      emitState('error');
      options.onError?.(new Error('Notification WebSocket error'));
    });
    socket.addEventListener('close', (event) => {
      socket = null;

      if (!hasOpenedOnce) {
        shouldReconnect = false;
        emitState('error');
        options.onError?.(
          new Error('Notification WebSocket closed before the connection was established'),
        );
        return;
      }

      if (event.code === 1008 || event.code === 4401 || event.code === 4403) {
        shouldReconnect = false;
        emitState('error');
        options.onError?.(
          new Error(`Notification WebSocket closed with code ${event.code}`),
        );
        return;
      }

      scheduleReconnect();
    });
  }

  function close() {
    shouldReconnect = false;
    clearReconnectTimer();

    if (socket) {
      socket.close(1000, 'client-close');
      socket = null;
    }

    hasOpenedOnce = false;
    emitState('closed');
  }

  function updateToken(accessToken: string) {
    options.accessToken = accessToken;
    close();
    shouldReconnect = true;
    reconnectAttempt = 0;
    void connect();
  }

  return {
    connect,
    close,
    updateToken,
  };
}
