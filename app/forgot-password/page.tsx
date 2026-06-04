'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations/auth';
import { useForgotPassword } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Mail, ArrowLeft, Send, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ForgotPasswordPage() {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-500 overflow-hidden selection:bg-[#0A5C4A]/30 selection:text-[var(--color-text-primary)]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative min-h-[90vh]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#0A5C4A]/10 dark:bg-[#10B981]/15 blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#1E88E5]/10 dark:bg-[#3B82F6]/15 blur-[100px]" 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md z-10"
        >
          <div className="glass border border-[var(--color-border)] rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-[var(--color-primary)]/5 backdrop-blur-xl bg-[var(--color-bg-card)]/80 relative overflow-hidden">
            {/* Inner subtle glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-gradient-to-b from-[var(--color-primary)]/10 to-transparent blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <Link href="/login" className="inline-flex items-center text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-6 group bg-[var(--color-muted)] px-3 py-1.5 rounded-full border border-[var(--color-border)]">
                  <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
                  Back to login
                </Link>
                
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-[#0A5C4A]/20">
                  <KeyRound className="text-white w-8 h-8" />
                </div>
                
                <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-3 tracking-tight">Forgot Password?</h1>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed max-w-xs mx-auto">
                  Enter your email and we&apos;ll send you a link to reset your password securely.
                </p>
              </div>

              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 bg-[var(--color-muted)] p-6 rounded-2xl border border-[var(--color-border)]"
                >
                  <div className="w-16 h-16 bg-[#10B981]/10 text-[#10B981] rounded-full flex items-center justify-center mx-auto">
                    <Send size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Check your email</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      We&apos;ve sent a password reset link to your registered email address.
                    </p>
                  </div>
                  <Button asChild fullWidth className="h-12 rounded-xl bg-[var(--color-text-primary)] text-[var(--color-bg)] hover:bg-[var(--color-text-secondary)] shadow-xl transition-all duration-300">
                    <Link href="/login">Return to Login</Link>
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <Input
                      label="Email Address"
                      placeholder="you@example.com"
                      type="email"
                      icon={<Mail size={18} />}
                      {...register('email')}
                      error={errors.email?.message}
                      autoComplete="email"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="pt-2"
                  >
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      loading={isPending}
                      className="h-14 rounded-xl text-lg bg-gradient-to-r from-[#0A5C4A] to-[#0d7a63] hover:from-[#0d7a63] hover:to-[#0A5C4A] dark:from-[#10B981] dark:to-[#059669] text-white shadow-xl shadow-[#0A5C4A]/20 dark:shadow-[#10B981]/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Send Reset Link <Send size={18} className="ml-2" />
                    </Button>
                  </motion.div>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
