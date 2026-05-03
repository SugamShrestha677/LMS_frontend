'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { UserRole } from '@/lib/types/auth';
import { getDashboardRoute } from '@/lib/utils/role-routes';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** If provided, only these roles can access this route */
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Fallback: check if the store is already hydrated even if the state hasn't updated
  const isActuallyHydrated = _hasHydrated || (typeof window !== 'undefined' && useAuthStore.persist.hasHydrated());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isActuallyHydrated || isLoading) return;

    // Not logged in → go to login
    if (!isAuthenticated || !user) {
      router.replace('/login');
      return;
    }

    // Wrong role → redirect to that role's own dashboard
    if (roles && !roles.includes(user.role)) {
      router.replace(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, user, isLoading, isActuallyHydrated, router, roles, mounted]);

  // Show skeleton while hydrating or before redirect fires
  if (!mounted || !isActuallyHydrated || isLoading) return <DashboardSkeleton />;
  if (!isAuthenticated || !user) return null;
  if (roles && !roles.includes(user.role)) return null;

  return <>{children}</>;
}
