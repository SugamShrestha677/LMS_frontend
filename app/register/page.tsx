'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { useRegister } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';
import { Mail, Lock, User, Building2, UserPlus, ArrowLeft, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'student',
    },
  });

  const currentRole = watch('role');

  const onSubmit = (data: RegisterInput) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] bg-[var(--color-primary)]/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[120px] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors mb-4 group">
              <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
              Back to home
            </Link>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">Create Your Account</h1>
            <p className="text-[var(--color-text-secondary)]">Join Leapfrog Connect and start your journey today</p>
          </div>

          <Card className="p-8 shadow-2xl border-[var(--color-border)] backdrop-blur-sm bg-[var(--color-bg-card)]/80">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Selector */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-[var(--color-text-primary)]">I am a...</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setValue('role', 'student')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      currentRole === 'student'
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <GraduationCap size={24} />
                    <span className="text-sm font-bold">Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue('role', 'company')}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200",
                      currentRole === 'company'
                        ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-text-secondary)] hover:border-gray-300 dark:hover:border-gray-600"
                    )}
                  >
                    <Building2 size={24} />
                    <span className="text-sm font-bold">Company</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  icon={<User size={18} />}
                  {...register('first_name')}
                  error={errors.first_name?.message}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  icon={<User size={18} />}
                  {...register('last_name')}
                  error={errors.last_name?.message}
                />
              </div>

              <Input
                label="Email Address"
                placeholder="john@example.com"
                type="email"
                icon={<Mail size={18} />}
                {...register('email')}
                error={errors.email?.message}
              />

              <AnimatePresence>
                {currentRole === 'company' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      label="Company Name"
                      placeholder="Leapfrog Tech"
                      icon={<Building2 size={18} />}
                      {...register('company_name')}
                      error={errors.company_name?.message}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  placeholder="••••••••"
                  type="password"
                  icon={<Lock size={18} />}
                  {...register('password')}
                  error={errors.password?.message}
                />
                <Input
                  label="Confirm Password"
                  placeholder="••••••••"
                  type="password"
                  icon={<Lock size={18} />}
                  {...register('confirm_password')}
                  error={errors.confirm_password?.message}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                size="lg"
                loading={isPending}
                className="h-12 rounded-xl shadow-xl shadow-[var(--color-primary)]/20"
              >
                Create Account <UserPlus size={18} className="ml-2" />
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Already have an account?{' '}
                <Link href="/login" className="font-bold text-[var(--color-primary)] hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
