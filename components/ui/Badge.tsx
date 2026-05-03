'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
}

const variantClasses = {
  primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border border-[var(--color-primary)]/20',
  secondary: 'bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] border border-[var(--color-secondary)]/20',
  success: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
  danger: 'bg-red-500/10 text-red-500 border border-red-500/20',
  info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
  default: 'bg-[var(--color-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]',
};

const dotColors = {
  primary: 'bg-[var(--color-primary)]',
  secondary: 'bg-[var(--color-secondary)]',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-blue-500',
  default: 'bg-[var(--color-text-secondary)]',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[10px] rounded-[var(--radius-sm)]',
  md: 'px-3 py-1 text-xs rounded-[var(--radius-sm)]',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-bold tracking-tight uppercase',
        variantClasses[variant],
        sizeClasses[size],
      )}
    >
      {dot && (
        <span className={cn('w-1 h-1 rounded-full flex-shrink-0', dotColors[variant], pulse && 'pulse-ring')} />
      )}
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  animated?: boolean;
  label?: string;
}

export function ProgressBar({ value, max = 100, color = 'var(--color-primary)', className, animated = true, label }: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex justify-between text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
          <span>{label}</span>
          <span className="font-mono">{Math.round(pct)}%</span>
        </div>
      )}
      <div className="h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden border border-[var(--color-border)]">
        <div
          className={cn('h-full rounded-full transition-all shadow-sm', animated && 'duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]')}
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}
