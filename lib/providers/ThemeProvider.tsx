'use client';

import { useUIStore } from '@/lib/store/uiStore';
import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useUIStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Save to localStorage for persistence
    localStorage.setItem('theme', theme);
  }, [theme]);

  return <>{children}</>;
}
