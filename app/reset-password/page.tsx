'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations/auth';
import { useResetPassword } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';
import { Lock, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { mutate: resetPassword, isPending, isSuccess } = useResetPassword();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordInput) => {
    if (!token) return;
    resetPassword({
      token,
      new_password: data.new_password,
      confirm_password: data.confirm_password,
    });
  };

  if (!token) {
    return (
      <Card className="p-8 text-center space-y-6 shadow-2xl border-red-500/20 bg-red-500/5">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-red-600">Invalid Reset Link</h3>
          <p className="text-sm text-[var(--color-text-secondary)]">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
        </div>
        <Button asChild fullWidth variant="outline" className="h-12 rounded-xl">
          <Link href="/forgot-password">Request New Link</Link>
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-2xl border-[var(--color-border)] backdrop-blur-sm bg-[var(--color-bg-card)]/80">
      {isSuccess ? (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Password Reset!</h3>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Your password has been successfully updated. You can now sign in with your new credentials.
            </p>
          </div>
          <Button asChild fullWidth className="h-12 rounded-xl">
            <Link href="/login">Sign In Now</Link>
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="New Password"
            placeholder="••••••••"
            type="password"
            icon={<Lock size={18} />}
            {...register('new_password')}
            error={errors.new_password?.message}
          />

          <Input
            label="Confirm New Password"
            placeholder="••••••••"
            type="password"
            icon={<Lock size={18} />}
            {...register('confirm_password')}
            error={errors.confirm_password?.message}
          />

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={isPending}
            className="h-12 rounded-xl shadow-xl shadow-[var(--color-primary)]/20"
          >
            Reset Password
          </Button>
        </form>
      )}
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[var(--color-primary)]/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/login" className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-4 group">
              <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to login
            </Link>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">Create New Password</h1>
            <p className="text-[var(--color-text-secondary)]">Your new password must be different from previously used passwords</p>
          </div>

          <Suspense fallback={
            <Card className="p-8 shadow-2xl animate-pulse bg-[var(--color-bg-card)]/80">
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl w-full" />
              </div>
            </Card>
          }>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </main>
    </div>
  );
}
