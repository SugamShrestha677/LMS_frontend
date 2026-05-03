'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-[#1E1E2A] mb-2">Something went wrong</h2>
            <p className="text-[#5A5A6E] text-sm mb-6">
              {this.state.error?.message ?? 'An unexpected error occurred. Please try again.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A5C4A] text-white rounded-xl text-sm font-semibold hover:bg-[#0d7a63] transition-colors"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </motion.div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  action?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-[#0A5C4A]/8 flex items-center justify-center mb-4">
          <Icon size={28} className="text-[#0A5C4A]" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#1E1E2A] mb-2">{title}</h3>
      {description && <p className="text-sm text-[#5A5A6E] max-w-xs mb-6">{description}</p>}
      {action}
    </motion.div>
  );
}
