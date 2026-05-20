'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSubmitPayment } from '@/lib/hooks/useCourses';
import { cn } from '@/lib/utils';

interface CoursePaymentModalProps {
  course: any;
  isOpen: boolean;
  onClose: () => void;
}

export function CoursePaymentModal({ course, isOpen, onClose }: CoursePaymentModalProps) {
  const [method, setMethod] = useState<'cash' | 'online'>('online');
  const [transactionId, setTransactionId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const submitPayment = useSubmitPayment();

  const handleSubmit = async () => {
    if (method === 'online' && !transactionId) {
      return;
    }

    setIsSubmitting(true);
    try {
      await submitPayment.mutateAsync({
        course: course.id,
        payment_method: method,
        transaction_id: method === 'online' ? transactionId : ''
      });
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-[var(--color-bg-card)] rounded-[2.5rem] border-2 border-[var(--color-border)] shadow-2xl overflow-hidden"
          >
            {isSuccess ? (
              <div className="p-10 text-center space-y-6">
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-500/20">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black tracking-tight text-[var(--color-text-primary)]">Payment Submitted!</h3>
                  <p className="text-[var(--color-text-secondary)] font-medium">
                    Your payment for <span className="font-bold text-[var(--color-primary)]">&quot;{course.title}&quot;</span> has been sent for verification.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-[var(--color-muted)]/50 border border-[var(--color-border)] text-sm text-[var(--color-text-secondary)] text-left flex gap-4">
                  <Info className="shrink-0 text-[var(--color-primary)]" size={20} />
                  <p>Our staff will verify your payment shortly. You will be automatically enrolled once confirmed. You can check the status in your dashboard.</p>
                </div>
                <Button 
                  onClick={onClose} 
                  className="w-full py-4 rounded-2xl font-black uppercase tracking-widest"
                >
                  Got it, Thanks!
                </Button>
              </div>
            ) : (
              <div className="flex flex-col">
                {/* Header */}
                <div className="p-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary)]/80 text-white relative">
                  <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <X size={20} />
                  </button>
                  <div className="space-y-2">
                    <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Course Enrollment</p>
                    <h3 className="text-2xl font-black tracking-tight leading-none">{course.title}</h3>
                    <div className="flex items-center gap-2 pt-2">
                      <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">
                        NPR {course.price}
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest opacity-80">
                        <ShieldCheck size={12} /> Secure Payment
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Method Selection */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Select Payment Method</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        { id: 'online', label: 'Online Payment', icon: CreditCard, desc: 'FonePay, Khalti, IME Pay' },
                        { id: 'cash', label: 'Cash Payment', icon: DollarSign, desc: 'Pay at front desk' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setMethod(opt.id as any)}
                          className={cn(
                            "p-5 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 group relative overflow-hidden",
                            method === opt.id 
                              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 shadow-lg shadow-[var(--color-primary)]/5" 
                              : "border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
                          )}
                        >
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            method === opt.id ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-muted)] text-[var(--color-text-secondary)]"
                          )}>
                            <opt.icon size={20} />
                          </div>
                          <div>
                            <p className={cn(
                              "font-black text-sm uppercase tracking-tight",
                              method === opt.id ? "text-[var(--color-primary)]" : "text-[var(--color-text-primary)]"
                            )}>{opt.label}</p>
                            <p className="text-[10px] text-[var(--color-text-secondary)] font-medium mt-0.5">{opt.desc}</p>
                          </div>
                          {method === opt.id && (
                            <motion.div layoutId="paymentActive" className="absolute top-2 right-2">
                              <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
                            </motion.div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Online Details */}
                  <AnimatePresence mode="wait">
                    {method === 'online' ? (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 flex gap-4">
                          <AlertCircle className="text-blue-500 shrink-0" size={20} />
                          <div className="space-y-1">
                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest">How to Pay Online?</p>
                            <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                              Please transfer <span className="font-black text-[var(--color-text-primary)]">NPR {course.price}</span> to our official account and enter the <span className="font-black text-[var(--color-text-primary)]">Transaction ID</span> below for verification.
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Transaction ID / Reference Number</label>
                          <input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="Enter the ID from your payment app..."
                            className="w-full px-5 py-4 bg-[var(--color-muted)]/50 border-2 border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all font-mono font-bold text-sm"
                          />
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/20 flex gap-4"
                      >
                        <DollarSign className="text-orange-500 shrink-0" size={20} />
                        <div className="space-y-1">
                          <p className="text-xs font-black text-orange-600 uppercase tracking-widest">Cash Payment</p>
                          <p className="text-[11px] text-[var(--color-text-secondary)] leading-relaxed">
                            Visit our front desk within the next 48 hours to complete your payment. Once you pay, our staff will verify your enrollment instantly.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Actions */}
                  <div className="flex flex-col gap-4">
                    <Button
                      onClick={handleSubmit}
                      disabled={isSubmitting || (method === 'online' && !transactionId)}
                      className="w-full py-5 rounded-2xl font-black uppercase tracking-[0.15em] shadow-2xl shadow-[var(--color-primary)]/30 text-base group"
                    >
                      {isSubmitting ? 'Processing...' : (
                        <span className="flex items-center justify-center gap-2">
                          Submit Payment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      )}
                    </Button>
                    <p className="text-center text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">
                      By submitting, you agree to our <span className="text-[var(--color-primary)]">Terms of Service</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
