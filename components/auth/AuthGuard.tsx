'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { UserRole } from '@/lib/types/auth';
import { getDashboardRoute } from '@/lib/utils/role-routes';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, _hasHydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const isActuallyHydrated = _hasHydrated || (typeof window !== 'undefined' && useAuthStore.persist.hasHydrated());

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isActuallyHydrated && !isLoading) {
      if (!isAuthenticated) {
        // Not logged in - redirect to login
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (user && user.must_change_password && pathname !== '/setup-password') {
        // User needs to change password first
        router.push('/setup-password');
        return;
      }

      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // User doesn't have required role
        const dashboardRoute = getDashboardRoute(user.role);
        router.push(dashboardRoute);
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, isActuallyHydrated, pathname, router, allowedRoles, mounted]);

  if (!mounted || !isActuallyHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#5A5A6E] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}