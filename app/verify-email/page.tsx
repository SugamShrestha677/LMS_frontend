'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useVerifyEmail, useResendOtp } from '@/lib/hooks/useAuth';
import { OtpInput } from '@/components/ui/OtpInput';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/layout/Navbar';
import { Mail, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { mutate: verify, isPending: isVerifying } = useVerifyEmail();
  const { mutate: resend, isPending: isResending } = useResendOtp();

  useEffect(() => {
    if (!email) {
      toast.error('No email found in request');
      router.replace('/register');
    }
  }, [email, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a 6-digit OTP');
      return;
    }
    if (email) {
      verify({ email, otp });
    }
  };

  const handleResend = () => {
    if (email) {
      resend({ email }, {
        onSuccess: () => {
          setTimer(60);
          setCanResend(false);
          setOtp('');
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#0A5C4A]/10 flex items-center justify-center mx-auto mb-6 text-[#0A5C4A]">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-3xl font-black text-[#1E1E2A] mb-2">Verify Your Email</h1>
        <p className="text-[#5A5A6E]">
          We&apos;ve sent a 6-digit code to <span className="font-bold text-[#1E1E2A]">{email}</span>
        </p>
      </div>

      <Card className="p-8 shadow-xl border-white/50 backdrop-blur-sm bg-white/80">
        <div className="space-y-8">
          <div className="space-y-4">
            <label className="block text-center text-sm font-bold text-[#5A5A6E]">
              Enter Verification Code
            </label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>

          <Button
            fullWidth
            size="lg"
            onClick={handleVerify}
            loading={isVerifying}
            className="h-12"
          >
            Verify Email <ArrowRight size={18} className="ml-2" />
          </Button>

          <div className="text-center">
            <p className="text-sm text-[#5A5A6E] mb-4">
              Didn&apos;t receive the code?
            </p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="inline-flex items-center gap-2 font-bold text-[#0A5C4A] hover:underline transition-all disabled:opacity-50"
              >
                <RefreshCw size={14} className={isResending ? 'animate-spin' : ''} />
                Resend Code
              </button>
            ) : (
              <p className="text-sm font-bold text-[#0A5C4A]">
                Resend in {timer}s
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 py-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-[30%] left-[5%] w-[150px] h-[150px] bg-[#0A5C4A]/10 rounded-3xl rotate-12 -z-10 blur-[60px]" />
        <div className="absolute bottom-[30%] right-[5%] w-[150px] h-[150px] bg-[#F5A623]/10 rounded-3xl -rotate-12 -z-10 blur-[60px]" />

        <Suspense fallback={<div className="text-center text-[#5A5A6E] font-medium">Loading...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </main>
    </div>
  );
}
