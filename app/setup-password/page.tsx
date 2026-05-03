'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { firstLoginSchema, FirstLoginInput } from '@/lib/validations/auth';
import { useFirstLogin } from '@/lib/hooks/useAuth';
import { useAuthStore } from '@/lib/store/auth-store';
import { getDashboardRoute } from '@/lib/utils/role-routes';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Lock, Shield, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupPasswordPage() {
  const router = useRouter();
  const { mutate: setupPassword, isPending } = useFirstLogin();
  const { isAuthenticated, user, isLoading } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FirstLoginInput>({
    resolver: zodResolver(firstLoginSchema),
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    // If user has already set password, send them to their role dashboard
    if (!isLoading && user && !user.must_change_password) {
      router.push(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, user, isLoading, router]);

  const onSubmit = (data: FirstLoginInput) => {
    setupPassword(data);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <div className="w-12 h-12 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAFAFA] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#0A5C4A]/5 via-transparent to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A5C4A]/10 rounded-full mb-4">
            <Shield size={32} className="text-[#0A5C4A]" />
          </div>
          <h1 className="text-3xl font-black text-[#1E1E2A] mb-2">Set Your Password</h1>
          <p className="text-[#5A5A6E]">
            Welcome! For security, please set a permanent password for your account.
          </p>
          {user && (
            <p className="text-sm text-[#0A5C4A] mt-2 font-medium">
              Logged in as: {user.email}
            </p>
          )}
        </div>

        <Card className="p-8 shadow-xl border-white/50 backdrop-blur-sm bg-white/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="New Password"
              placeholder="Enter new password"
              type="password"
              icon={<Lock size={18} />}
              {...register('new_password')}
              error={errors.new_password?.message}
              autoComplete="new-password"
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm new password"
              type="password"
              icon={<KeyRound size={18} />}
              {...register('confirm_password')}
              error={errors.confirm_password?.message}
              autoComplete="new-password"
            />

            <div className="bg-[#FFF3DC] border border-[#F5A623]/20 rounded-lg p-4">
              <p className="text-sm font-semibold text-[#1E1E2A] mb-2">Password Requirements:</p>
              <ul className="text-sm text-[#5A5A6E] space-y-1">
                <li>• At least 8 characters long</li>
                <li>• One uppercase letter (A-Z)</li>
                <li>• One lowercase letter (a-z)</li>
                <li>• One number (0-9)</li>
                <li>• One special character (@$!%*?&)</li>
              </ul>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={isPending}
              className="h-12"
            >
              Set Password & Continue
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}