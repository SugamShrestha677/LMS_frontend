'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { registerSchema, RegisterInput } from '@/lib/validations/auth';
import { useRegister } from '@/lib/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/layout/Navbar';
import { Mail, Lock, User, Building2, UserPlus, ArrowLeft, GraduationCap, Users, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
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

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-500 overflow-hidden selection:bg-[#0A5C4A]/30 selection:text-[var(--color-text-primary)]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8 relative min-h-[90vh]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              rotate: [0, -360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-5%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#0A5C4A]/10 dark:bg-[#10B981]/15 blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              rotate: [-360, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-[#1E88E5]/10 dark:bg-[#3B82F6]/15 blur-[100px]" 
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-6xl z-10"
        >
          <div className="flex flex-col lg:flex-row-reverse rounded-[2.5rem] overflow-hidden glass border border-[var(--color-border)] shadow-2xl shadow-[var(--color-primary)]/5 backdrop-blur-xl bg-[var(--color-bg-card)]/80">
            
            {/* Right Side: Form (Rendered first visually via flex-row-reverse or just order) */}
            <div className="flex-1 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
              <div className="max-w-lg w-full mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <Link href="/" className="inline-flex items-center text-sm font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors group bg-[var(--color-muted)] px-3 py-1.5 rounded-full border border-[var(--color-border)]">
                    <ArrowLeft size={16} className="mr-1.5 transition-transform group-hover:-translate-x-1" />
                    Home
                  </Link>
                  <div className="text-sm font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
                    Step 1 of 1
                  </div>
                </div>
                
                <h1 className="text-4xl font-black text-[var(--color-text-primary)] mb-2 tracking-tight">
                  Join <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6]">Leapfrog Connect</span>
                </h1>
                <p className="text-[var(--color-text-secondary)] mb-8 text-lg">
                  Create your account and unlock your potential.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  {/* Role Selector */}
                  <div className="space-y-3 bg-[var(--color-muted)] p-2 rounded-2xl border border-[var(--color-border)]">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setValue('role', 'student')}
                        className={cn(
                          "flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 font-bold text-sm",
                          currentRole === 'student'
                            ? "bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-md border border-[var(--color-border)]"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)]/50 border border-transparent"
                        )}
                      >
                        <GraduationCap size={18} className={currentRole === 'student' ? "text-[#10B981]" : ""} />
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setValue('role', 'company')}
                        className={cn(
                          "flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300 font-bold text-sm",
                          currentRole === 'company'
                            ? "bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-md border border-[var(--color-border)]"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)]/50 border border-transparent"
                        )}
                      >
                        <Building2 size={18} className={currentRole === 'company' ? "text-[#3B82F6]" : ""} />
                        Company
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                      <Input
                        label="First Name"
                        placeholder="John"
                        icon={<User size={18} />}
                        {...register('first_name')}
                        error={errors.first_name?.message}
                      />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                      <Input
                        label="Last Name"
                        placeholder="Doe"
                        icon={<User size={18} />}
                        {...register('last_name')}
                        error={errors.last_name?.message}
                      />
                    </motion.div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Input
                      label="Email Address"
                      placeholder="john@example.com"
                      type="email"
                      icon={<Mail size={18} />}
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </motion.div>

                  <AnimatePresence mode="popLayout">
                    {currentRole === 'company' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
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
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                      <Input
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        icon={<Lock size={18} />}
                        {...register('password')}
                        error={errors.password?.message}
                      />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        type="password"
                        icon={<Lock size={18} />}
                        {...register('confirm_password')}
                        error={errors.confirm_password?.message}
                      />
                    </motion.div>
                  </div>

                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-2">
                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      loading={isPending}
                      className="h-14 rounded-xl text-lg bg-[var(--color-text-primary)] text-[var(--color-bg)] hover:bg-[var(--color-text-secondary)] shadow-xl transition-all duration-300 hover:scale-[1.02]"
                    >
                      Create Account <UserPlus size={20} className="ml-2" />
                    </Button>
                  </motion.div>
                </form>

                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t border-[var(--color-border)] text-center"
                >
                  <p className="text-[var(--color-text-secondary)] font-medium">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[var(--color-primary)] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                      Sign in
                    </Link>
                  </p>
                </motion.div>
              </div>
            </div>
            
            {/* Left Side: Features/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-1 relative bg-[var(--color-bg-primary)] flex-col justify-between p-12 overflow-hidden border-r border-[var(--color-border)]">
              <div className="absolute inset-0 bg-gradient-to-bl from-[#0A5C4A]/5 via-transparent to-[#1E88E5]/5 dark:from-[#10B981]/10 dark:to-[#3B82F6]/10" />
              
              <div className="relative z-10">
                <h3 className="text-3xl font-black text-[var(--color-text-primary)] mb-6">
                  Why join <br />Leapfrog Connect?
                </h3>
                
                <div className="space-y-8 mt-10">
                  {[
                    { icon: ShieldCheck, title: "Industry Verified", desc: "Earn certificates recognized by top tech companies in Nepal.", color: "text-[#10B981]" },
                    { icon: Zap, title: "Direct Placements", desc: "Get fast-tracked to interviews based on your assessment scores.", color: "text-[#3B82F6]" },
                    { icon: Users, title: "Active Community", desc: "Join 10,000+ learners and alumni growing their careers.", color: "text-[#8B5CF6]" }
                  ].map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + (i * 0.1) }}
                      className="flex items-start gap-4"
                    >
                      <div className={`p-3 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] ${item.color}`}>
                        <item.icon size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">{item.title}</h4>
                        <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              <div className="relative z-10 glass border border-[var(--color-border)] rounded-2xl p-6 mt-12 flex items-center justify-between">
                 <div>
                   <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-1">Join leading companies</p>
                   <div className="flex gap-2">
                     <div className="w-8 h-8 rounded bg-[var(--color-text-primary)] opacity-20"></div>
                     <div className="w-8 h-8 rounded bg-[var(--color-text-primary)] opacity-20"></div>
                     <div className="w-8 h-8 rounded bg-[var(--color-text-primary)] opacity-20"></div>
                   </div>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-black text-[var(--color-text-primary)]">500+</p>
                   <p className="text-xs text-[var(--color-text-secondary)] font-bold uppercase">Partners</p>
                 </div>
              </div>
            </div>
            
          </div>
        </motion.div>
      </main>
    </div>
  );
}
