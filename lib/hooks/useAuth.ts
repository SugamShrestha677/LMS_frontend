'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { authService } from '@/lib/services/auth.service';
import { useAuthStore } from '@/lib/store/auth-store';
import { LoginInput, FirstLoginInput } from '@/lib/types/auth';
import { getDashboardRoute } from '@/lib/utils/role-routes';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      const { user, tokens } = response;
      
      // Save auth state
      setAuth(user, tokens.access, tokens.refresh);
      
      toast.success(response.message || 'Login successful!');
      
      // Check if user needs to change password
      if (user.must_change_password) {
        router.push('/setup-password');
      } else {
        // Redirect to role-based dashboard
        const dashboardRoute = getDashboardRoute(user.role);
        router.push(dashboardRoute);
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || error.response?.data?.detail || 'Login failed. Please try again.';
      toast.error(message);
    },
  });
}

export function useFirstLogin() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: FirstLoginInput) => authService.firstLogin(data),
    onSuccess: (response) => {
      const { user, tokens } = response;
      
      // Save new auth state (old tokens invalidated)
      setAuth(user, tokens.access, tokens.refresh);
      
      toast.success('Password set successfully!');
      
      // Redirect to role-based dashboard
      const dashboardRoute = getDashboardRoute(user.role);
      router.push(dashboardRoute);
    },
    onError: (error: any) => {
      const data = error.response?.data;
      const message = data?.error || data?.detail || 
                     (data && Object.values(data)[0]) || 
                     'Failed to set password.';
      toast.error(typeof message === 'string' ? message : 'Validation error occurred');
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { logout, refreshToken } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      // Best-effort server-side blacklist — always clear local state regardless
      if (refreshToken) {
        try {
          await authService.logout(refreshToken);
        } catch {
          // Ignore server errors — we still log out locally
        }
      }
    },
    onSettled: () => {
      // Always clear auth state and redirect — even on error
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
    },
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => authService.getUsers(),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { email: string; personal_email: string; role: string }) => 
      authService.createUser(data),
    onSuccess: (response) => {
      toast.success(response.message || 'User created successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.error || 'Failed to create user.';
      toast.error(message);
    },
  });
}