'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth';
import { useAuthStore, AuthUser } from '@/lib/store/authStore';
import { LoginInput, RegisterInput } from '@/lib/validations/auth';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

// Toggle this for testing without a backend
const USE_MOCK = true;

export function useMe() {
  const { isAuthenticated, user } = useAuthStore();
  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      if (USE_MOCK) return user;
      return authApi.getCurrentUser();
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginInput) => {
      if (USE_MOCK) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Return dummy user based on email (for testing different roles)
        let role: AuthUser['role'] = 'student';
        if (data.email.includes('admin')) role = 'admin';
        if (data.email.includes('company')) role = 'company';

        return {
          user: {
            id: 1,
            email: data.email,
            first_name: data.email.split('@')[0],
            last_name: 'Demo',
            role: role,
            is_verified: true,
          },
          access: 'mock_access_token',
          refresh: 'mock_refresh_token',
        };
      }
      return authApi.login(data);
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access, data.refresh);
      toast.success(`Welcome back, ${data.user.first_name}!`);

      const role = data.user.role;
      if (role === 'student') router.push('/student/dashboard');
      else if (role === 'company') router.push('/company/dashboard');
      else if (['admin', 'super_admin', 'staff'].includes(role)) router.push('/admin/dashboard');
      else router.push('/');
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail ?? 'Login failed. Please try again.');
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      }
      return authApi.register(data);
    },
    onSuccess: (_data, variables) => {
      toast.success('Account created! Please verify your email.');
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (err: any) => {
      const errors = err?.response?.data;
      if (errors) {
        const firstError = Object.values(errors)[0]?.[0];
        toast.error(firstError ?? 'Registration failed.');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    },
  });
}

export function useVerifyEmail() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      if (USE_MOCK) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          user: {
            id: 1,
            email: email,
            first_name: 'Demo',
            last_name: 'User',
            role: 'student',
            is_verified: true,
          },
          access: 'mock_access_token',
          refresh: 'mock_refresh_token',
        };
      }
      return authApi.verifyEmail({ email, otp });
    },
    onSuccess: (data) => {
      setAuth(data.user, data.access, data.refresh);
      toast.success('Email verified successfully!');
      router.push('/student/dashboard');
    },
    onError: () => {
      toast.error('Invalid OTP. Please try again.');
    },
  });
}

export function useResendOtp() {
  return useMutation({
    mutationFn: async (email: string) => {
      if (USE_MOCK) return { success: true };
      return authApi.resendOtp(email);
    },
    onSuccess: () => toast.success('OTP sent to your email!'),
    onError: () => toast.error('Failed to resend OTP.'),
  });
}

export function useLogout() {
  const { logout, refreshToken } = useAuthStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      if (USE_MOCK) return { success: true };
      return authApi.logout();
    },
    onSettled: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully.');
      router.push('/login');
    },
  });
}
