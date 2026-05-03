'use client';

import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helper, className, type, id, ...props }, ref) => {
    const [showPass, setShowPass] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPass ? 'text' : 'password') : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[#1E1E2A]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5A6E] pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            type={inputType}
            className={cn(
              'w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm text-[#1E1E2A] placeholder:text-[#9ca3af] transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[#0A5C4A] focus:border-transparent',
              'hover:border-[#0A5C4A]/40',
              error && 'border-red-400 focus:ring-red-400',
              icon && 'pl-10',
              isPassword && 'pr-11',
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A5A6E] hover:text-[#1E1E2A] transition-colors"
              onClick={() => setShowPass((v) => !v)}
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-red-500 font-medium"
            >
              {error}
            </motion.p>
          )}
          {helper && !error && (
            <motion.p
              key="helper"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-[#5A5A6E]"
            >
              {helper}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = 'Input';
