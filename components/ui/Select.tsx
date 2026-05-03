'use client';

import { cn } from '@/lib/utils';
import { forwardRef, SelectHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helper?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon, helper, className, id, options, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none">
              {icon}
            </span>
          )}
          <select
            ref={ref}
            id={id}
            className={cn(
              'w-full appearance-none rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
              'hover:border-[var(--color-primary)]/40',
              error && 'border-red-400 focus:ring-red-400',
              icon && 'pl-10',
              'pr-10',
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] pointer-events-none">
            <ChevronDown size={18} />
          </div>
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
              className="text-xs text-[var(--color-text-secondary)]"
            >
              {helper}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

Select.displayName = 'Select';
