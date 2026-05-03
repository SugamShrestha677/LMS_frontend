'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { loginSchema, LoginInput } from '@/lib/validations/auth';
import { useLogin } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';
import { Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();
  
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

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] bg-[#0A5C4A]/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-[#F5A623]/5 rounded-full blur-[100px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-[#5A5A6E] hover:text-[#0A5C4A] transition-colors mb-4 group">
              <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
            <h1 className="text-3xl font-black text-[#1E1E2A] mb-2">Welcome Back</h1>
            <p className="text-[#5A5A6E]">Enter your credentials to access your account</p>
          </div>

          <Card className="p-8 shadow-xl border-white/50 backdrop-blur-sm bg-white/80">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email Address"
                placeholder="you@example.com"
                type="email"
                icon={<Mail size={18} />}
                {...register('email')}
                error={errors.email?.message}
                autoComplete="email"
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={<Lock size={18} />}
                  {...register('password')}
                  error={errors.password?.message}
                  autoComplete="current-password"
                />
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#0A5C4A] hover:underline">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isPending}
                className="h-12"
              >
                Sign In <LogIn size={18} className="ml-2" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#e5e7eb] text-center">
              <p className="text-sm text-[#5A5A6E]">
                Don't have an account?{' '}
                <Link href="/register" className="font-bold text-[#0A5C4A] hover:underline">
                  Create an account
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}