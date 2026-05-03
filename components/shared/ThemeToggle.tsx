'use client';

import { Moon, Sun } from 'lucide-react';
import { useUIStore } from '@/lib/store/uiStore';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[#5A5A6E] hover:bg-gray-100 dark:hover:bg-[#2D2D2D] transition-colors overflow-hidden"
      aria-label="Toggle Theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {mounted && (
          <>
            <motion.div
              initial={false}
              animate={{
                y: theme === 'light' ? 0 : 40,
                rotate: theme === 'light' ? 0 : 45,
                opacity: theme === 'light' ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'backOut' }}
              className="absolute"
            >
              <Sun size={20} />
            </motion.div>
            <motion.div
              initial={false}
              animate={{
                y: theme === 'dark' ? 0 : -40,
                rotate: theme === 'dark' ? 0 : -45,
                opacity: theme === 'dark' ? 1 : 0
              }}
              transition={{ duration: 0.3, ease: 'backOut' }}
              className="absolute"
            >
              <Moon size={20} />
            </motion.div>
          </>
        )}
      </div>
    </button>
  );
}
