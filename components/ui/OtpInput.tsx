'use client';

import { useRef, KeyboardEvent, ClipboardEvent } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface OtpInputProps {
  value: string;
  onChange: (val: string) => void;
  length?: number;
  error?: boolean;
}

export function OtpInput({ value, onChange, length = 6, error = false }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const focus = (i: number) => {
    setTimeout(() => inputs.current[i]?.focus(), 0);
  };

  const handleChange = (i: number, v: string) => {
    if (!/^\d?$/.test(v)) return;
    const arr = value.split('');
    arr[i] = v;
    const next = arr.join('').slice(0, length);
    onChange(next.padEnd(length, ' ').slice(0, length).trimEnd());
    if (v && i < length - 1) focus(i + 1);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!value[i] && i > 0) {
        const arr = value.split('');
        arr[i - 1] = '';
        onChange(arr.join(''));
        focus(i - 1);
      }
    } else if (e.key === 'ArrowLeft' && i > 0) {
      focus(i - 1);
    } else if (e.key === 'ArrowRight' && i < length - 1) {
      focus(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
    focus(Math.min(pasted.length, length - 1));
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length }).map((_, i) => (
        <motion.input
          key={i}
          ref={(el) => { inputs.current[i] = el; }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.06, duration: 0.2 }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          className={cn(
            'w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200',
            'focus:border-[#0A5C4A] focus:bg-[#0A5C4A]/5 focus:scale-105',
            'bg-white text-[#1E1E2A]',
            error
              ? 'border-red-400 bg-red-50'
              : value[i]
                ? 'border-[#0A5C4A] bg-[#0A5C4A]/5'
                : 'border-gray-200 hover:border-gray-300',
          )}
        />
      ))}
    </div>
  );
}
