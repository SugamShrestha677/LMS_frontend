'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import { useForgotPassword } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordInput) => {
    forgotPassword(data.email);
  };

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
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">Forgot Password</h1>
            <p className="text-[var(--color-text-secondary)]">Enter your email and we&apos;ll send you a link to reset your password</p>
          </div>

          <Card className="p-8 shadow-2xl border-[var(--color-border)] backdrop-blur-sm bg-[var(--color-bg-card)]/80">
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                  <Send size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Check your email</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    We&apos;ve sent a password reset link to your registered personal email address.
                  </p>
                </div>
                <Button asChild fullWidth className="h-12 rounded-xl">
                  <Link href="/login">Return to Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  label="Organization Email"
                  placeholder="you@leapfrogconnect.com"
                  type="email"
                  icon={<Mail size={18} />}
                  {...register('email')}
                  error={errors.email?.message}
                  autoComplete="email"
                />

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  loading={isPending}
                  className="h-12 rounded-xl shadow-xl shadow-[var(--color-primary)]/20"
                >
                  Send Reset Link <Send size={18} className="ml-2" />
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
