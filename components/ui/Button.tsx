'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

const variants = {
  primary: 'bg-[var(--color-primary)] text-white hover:opacity-90 shadow-[var(--shadow-sm)]',
  secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90 shadow-[var(--shadow-sm)]',
  outline: 'border-2 border-[var(--color-border)] text-[var(--color-text-primary)] hover:bg-[var(--color-muted)]',
  ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)]',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
};

const sizes = {
  sm: 'px-4 py-2 text-xs rounded-[var(--radius-sm)] gap-2',
  md: 'px-6 py-3 text-sm rounded-[var(--radius-md)] gap-2.5',
  lg: 'px-8 py-4 text-base rounded-[var(--radius-md)] gap-3',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98, y: 1 }}
        whileHover={{ y: -1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className={cn(
          'relative inline-flex items-center justify-center font-bold tracking-tight transition-all cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:translate-y-px',
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className,
        )}
        disabled={disabled || loading}
        {...(props as any)}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={cn('flex items-center gap-inherit', loading && 'opacity-0')}>
          {children}
        </span>
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
