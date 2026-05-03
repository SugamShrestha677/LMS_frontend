'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, UserRole } from '@/lib/store/authStore';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
      return;
    }
    if (!isLoading && isAuthenticated && user && roles && !roles.includes(user.role)) {
      // Redirect to their proper dashboard if wrong role
      if (user.role === 'student') router.replace('/student/dashboard');
      else if (user.role === 'company') router.replace('/company/dashboard');
      else router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, user, isLoading, router, roles]);

  if (isLoading) return <DashboardSkeleton />;
  if (!isAuthenticated) return <DashboardSkeleton />;
  if (roles && user && !roles.includes(user.role)) return <DashboardSkeleton />;

  return <>{children}</>;
}
