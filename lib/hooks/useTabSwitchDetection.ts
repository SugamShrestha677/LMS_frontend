'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseTabSwitchDetectionProps {
  onTabSwitch: () => void;
  onReturn: () => void;
  enabled: boolean;
  warningThreshold?: number;
}

export function useTabSwitchDetection({
  onTabSwitch,
  onReturn,
  enabled = true,
  warningThreshold = 3,
}: UseTabSwitchDetectionProps) {
  const switchCountRef = useRef(0);
  const awayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isAwayRef = useRef(false);
  const lastSwitchTimeRef = useRef<number>(0);

  const handleVisibilityChange = useCallback(() => {
    if (!enabled) return;

    if (document.hidden) {
      // User switched away
      isAwayRef.current = true;
      lastSwitchTimeRef.current = Date.now();
      onTabSwitch();

      // Start 3-second timer
      awayTimerRef.current = setTimeout(() => {
        if (isAwayRef.current && Date.now() - lastSwitchTimeRef.current >= 3000) {
          switchCountRef.current += 1;
          // Auto-submit if too many switches
        }
      }, 3000);
    } else {
      // User returned
      isAwayRef.current = false;
      if (awayTimerRef.current) {
        clearTimeout(awayTimerRef.current);
        awayTimerRef.current = null;
      }
      onReturn();
    }
  }, [enabled, onTabSwitch, onReturn]);

  const handleWindowBlur = useCallback(() => {
    if (!enabled) return;
    isAwayRef.current = true;
    lastSwitchTimeRef.current = Date.now();
    onTabSwitch();

    awayTimerRef.current = setTimeout(() => {
      if (isAwayRef.current && Date.now() - lastSwitchTimeRef.current >= 3000) {
        switchCountRef.current += 1;
      }
    }, 3000);
  }, [enabled, onTabSwitch]);

  const handleWindowFocus = useCallback(() => {
    if (!enabled) return;
    isAwayRef.current = false;
    if (awayTimerRef.current) {
      clearTimeout(awayTimerRef.current);
      awayTimerRef.current = null;
    }
    onReturn();
  }, [enabled, onReturn]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      if (awayTimerRef.current) {
        clearTimeout(awayTimerRef.current);
      }
    };
  }, [enabled, handleVisibilityChange, handleWindowBlur, handleWindowFocus]);

  return {
    switchCount: switchCountRef.current,
    resetCount: () => { switchCountRef.current = 0; },
  };
}