'use client';

import {
  buildEnrollmentProgressSocketUrl,
  normalizeEnrollmentProgressEvent,
} from './enrollmentProgress';
import { resolveApiBaseUrl } from '@/lib/config/runtime-urls';
import type {
  CreateCourseProgressClientOptions,
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

export function createCourseProgressClient(
  options: CreateCourseProgressClientOptions,
) {
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectAttempt = 0;
  let shouldReconnect = true;
  let lastFingerprint: string | null = null;
  let hasOpenedOnce = false;

  const policy = {
    enabled: options.reconnect?.enabled ?? true,
    initialDelayMs: options.reconnect?.initialDelayMs ?? 500,
    maxDelayMs: options.reconnect?.maxDelayMs ?? 30000,
    backoffFactor: options.reconnect?.backoffFactor ?? 1.8,
    maxAttempts: options.reconnect?.maxAttempts ?? 8,
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
      options.onError?.(new Error('WebSocket reconnect attempts exhausted'));
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

      if (
        typeof parsed.progress !== 'number' ||
        typeof parsed.status !== 'string'
      ) {
        return;
      }

      const event = normalizeEnrollmentProgressEvent(options.enrollmentId, {
        progress: parsed.progress,
        status: parsed.status,
        score:
          parsed.score === null || parsed.score === undefined
            ? null
            : typeof parsed.score === 'number'
              ? parsed.score
              : null,
      });

      if (event.fingerprint === lastFingerprint) {
        return;
      }

      lastFingerprint = event.fingerprint;
      options.onEvent?.(event);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to parse websocket payload';
      options.onError?.(new Error(message));
    }
  };

  async function connect() {
    if (typeof WebSocket === 'undefined') {
      throw new Error('WebSocket is not available in this environment');
    }

    const url = buildEnrollmentProgressSocketUrl(
      options.enrollmentId,
      options.baseUrl || resolveApiBaseUrl(),
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
      options.onError?.(new Error('WebSocket error'));
    });
    socket.addEventListener('close', (event) => {
      socket = null;

      if (!hasOpenedOnce) {
        shouldReconnect = false;
        emitState('error');
        options.onError?.(new Error('WebSocket closed before the connection was established'));
        return;
      }

      if (event.code === 1008 || event.code === 4401 || event.code === 4403) {
        shouldReconnect = false;
        emitState('error');
        options.onError?.(
          new Error(`WebSocket closed with code ${event.code}; authentication is required.`),
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

    emitState('closed');
  }

  function getSnapshot() {
    return {
      socket,
      reconnectAttempt,
      lastFingerprint,
    };
  }

  return {
    connect,
    close,
    getSnapshot,
  };
}
