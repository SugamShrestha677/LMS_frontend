'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
}

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className,
  hover = false,
  glass = false,
  padding = 'md',
  onClick,
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: 'var(--shadow-lg)' } : undefined}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      onClick={onClick}
      className={cn(
        'rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-card)]',
        'shadow-[var(--shadow-md)]',
        hover && 'cursor-pointer transition-all duration-300',
        glass && 'glass',
        paddings[padding],
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: string;
  changePositive?: boolean;
  color?: string;
}

export function StatCard({ title, value, icon, change, changePositive, color = '#0A5C4A' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: 'var(--shadow-lg)' }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 shadow-[var(--shadow-md)]"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">{title}</p>
          <p className="mt-2 text-3xl font-black text-[var(--color-text-primary)] font-mono">{value}</p>
          {change && (
            <p className={cn('mt-2 text-xs font-bold flex items-center gap-1', changePositive ? 'text-emerald-500' : 'text-red-500')}>
              <span className="w-4 h-4 rounded-full flex items-center justify-center bg-current opacity-10">
                {changePositive ? '↑' : '↓'}
              </span>
              {change}
            </p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-black/5 dark:border-white/5"
          style={{ 
            background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`, 
            color 
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
