'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { useLogin } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Mail, Lock, LogIn, ArrowLeft, Sparkles, GraduationCap, Quote } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    login(data);
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
          className="w-full max-w-5xl z-10"
        >
          <div className="flex flex-col lg:flex-row rounded-[2.5rem] overflow-hidden glass border border-[var(--color-border)] shadow-2xl shadow-[var(--color-primary)]/5 backdrop-blur-xl bg-[var(--color-bg-card)]/80">
            
            {/* Left Side: Form */}
            <div className="flex-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto">
                <Link href="/" className="inline-flex items-center text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-8 group bg-[var(--color-muted)] px-3 py-1.5 rounded-full border border-[var(--color-border)] w-fit">
                  <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
                  Back to home
                </Link>
                
                <h1 className="text-4xl font-black text-[var(--color-text-primary)] mb-3 tracking-tight">
                  Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6]">Back</span>
                </h1>
                <p className="text-[var(--color-text-secondary)] mb-10 text-lg leading-relaxed">
                  Sign in to continue your learning journey and connect with top employers.
                </p>

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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="space-y-1"
                  >
                    <Input
                      label="Password"
                      placeholder="••••••••"
                      type="password"
                      icon={<Lock size={18} />}
                      {...register('password')}
                      error={errors.password?.message}
                      autoComplete="current-password"
                    />
                    <div className="flex justify-end pt-1">
                      <Link href="/forgot-password" className="text-sm font-bold text-[var(--color-primary)] hover:text-[#1E88E5] dark:hover:text-[#3B82F6] transition-colors">
                        Forgot password?
                      </Link>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="pt-4"
                  >
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      loading={isPending}
                      className="h-14 rounded-xl text-lg bg-gradient-to-r from-[#0A5C4A] to-[#0d7a63] hover:from-[#0d7a63] hover:to-[#0A5C4A] dark:from-[#10B981] dark:to-[#059669] text-white shadow-xl shadow-[#0A5C4A]/20 dark:shadow-[#10B981]/20 transition-all duration-300 hover:scale-[1.02]"
                    >
                      Sign In <LogIn size={20} className="ml-2" />
                    </Button>
                  </motion.div>
                </form>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-10 pt-8 border-t border-[var(--color-border)] text-center"
                >
                  <p className="text-[var(--color-text-secondary)] font-medium">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="font-bold text-[var(--color-primary)] hover:text-[#1E88E5] dark:hover:text-[#3B82F6] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-current after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                      Create an account
                    </Link>
                  </p>
                </motion.div>
              </div>
            </div>
            
            {/* Right Side: Visual/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-1 relative bg-[var(--color-bg-primary)] items-center justify-center p-12 overflow-hidden border-l border-[var(--color-border)]">
              {/* Complex inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A5C4A]/5 via-[#1E88E5]/5 to-[#7C3AED]/5 dark:from-[#10B981]/10 dark:via-[#3B82F6]/10 dark:to-[#8B5CF6]/10" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] dark:opacity-10 mix-blend-overlay" />
              
              <div className="relative z-10 max-w-md w-full">
                <div className="glass border border-[var(--color-border)] p-8 rounded-3xl shadow-2xl relative">
                  <div className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#0A5C4A]/20 transform rotate-12">
                    <Sparkles className="text-white w-8 h-8" />
                  </div>
                  
                  <Quote className="text-[var(--color-border)] w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-4 leading-snug">
                    "Leapfrog Connect helped me land my dream job at a top tech company right after finishing my courses."
                  </h3>
                  
                  <div className="flex items-center gap-4 mt-8 pt-6 border-t border-[var(--color-border)]">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-muted)] flex items-center justify-center overflow-hidden border-2 border-[var(--color-primary)]">
                       <GraduationCap className="text-[var(--color-primary)] w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)] text-sm">Alisha Thapa</p>
                      <p className="text-xs text-[var(--color-text-secondary)] font-medium">Software Engineer @ Leapfrog Tech</p>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                   <div className="glass border border-[var(--color-border)] p-5 rounded-2xl">
                     <p className="text-3xl font-black text-[var(--color-text-primary)]">98%</p>
                     <p className="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider">Placement Rate</p>
                   </div>
                   <div className="glass border border-[var(--color-border)] p-5 rounded-2xl">
                     <p className="text-3xl font-black text-[var(--color-text-primary)]">500+</p>
                     <p className="text-xs text-[var(--color-text-secondary)] font-semibold uppercase tracking-wider">Hiring Partners</p>
                   </div>
                </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </main>
    </div>
  );
}