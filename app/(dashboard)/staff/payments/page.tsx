'use client';

import { useStaffPayments, useConfirmStaffPayment, useRejectStaffPayment } from '@/lib/hooks/useStaffData';
import { 
  CreditCard, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  BookOpen, 
  DollarSign,
  Eye,
  MoreVertical,
  ChevronRight,
  RefreshCcw,
  AlertCircle,
  UserCheck
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function StaffPaymentsPage() {
  const { data: payments, isLoading, error, refetch } = useStaffPayments();
  const confirmPayment = useConfirmStaffPayment();
  const rejectPayment = useRejectStaffPayment();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'rejected'>('all');
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const filteredPayments = useMemo(() => {
    if (!payments || !Array.isArray(payments)) return [];
    return payments.filter((p: any) => {
      const matchesSearch = 
        (p.student_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.student_email || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.course_title || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.transaction_id && p.transaction_id.toLowerCase().includes(search.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const handleConfirm = async (id: number) => {
    if (window.confirm('Are you sure you want to confirm this payment?')) {
      await confirmPayment.mutateAsync(id);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) return;
    await rejectPayment.mutateAsync({ paymentId: selectedPayment.id, reason: rejectionReason });
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedPayment(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
        <p className="text-[var(--color-text-secondary)] font-black uppercase tracking-widest text-xs">Loading Payments...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tighter text-[var(--color-text-primary)] uppercase">
            Payment <span className="text-[var(--color-primary)]">Verification</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-sm font-medium tracking-tight">
            Manage course enrollments and verify student payments
          </p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-[var(--color-primary)]/30 hover:scale-105 transition-transform active:scale-95"
        >
          <RefreshCcw size={18} className={cn(isLoading && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Payments', value: payments?.length || 0, icon: DollarSign, color: 'blue' },
          { label: 'Pending', value: payments?.filter((p: any) => p.status === 'pending').length || 0, icon: Clock, color: 'orange' },
          { label: 'Confirmed', value: payments?.filter((p: any) => p.status === 'confirmed').length || 0, icon: CheckCircle, color: 'green' },
          { label: 'Rejected', value: payments?.filter((p: any) => p.status === 'rejected').length || 0, icon: XCircle, color: 'red' },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-6 rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] shadow-sm flex items-center gap-5"
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg",
              stat.color === 'blue' && "bg-blue-500/10 text-blue-500 shadow-blue-500/10",
              stat.color === 'orange' && "bg-orange-500/10 text-orange-500 shadow-orange-500/10",
              stat.color === 'green' && "bg-green-500/10 text-green-500 shadow-green-500/10",
              stat.color === 'red' && "bg-red-500/10 text-red-500 shadow-red-500/10",
            )}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-[var(--color-text-secondary)] text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)] mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="p-6 rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] shadow-sm flex flex-col md:flex-row gap-6">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search student name, email, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[var(--color-muted)]/30 border-2 border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-[var(--color-primary)] transition-all text-sm font-medium"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={cn(
                "px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                statusFilter === status 
                  ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20" 
                  : "bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[var(--radius-lg)] bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30 border-b-2 border-[var(--color-border)]">
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Student</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Course</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Amount</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Method</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Date</th>
                <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[var(--color-border)]">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment: any, idx: number) => (
                  <motion.tr 
                    key={payment.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-[var(--color-muted)]/20 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-black text-xs">
                          {payment.student_name?.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors tracking-tight">{payment.student_name}</p>
                          <p className="text-[10px] text-[var(--color-text-secondary)] font-medium mt-0.5">{payment.student_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-bold text-[var(--color-text-primary)] truncate max-w-[200px] tracking-tight">{payment.course_title}</p>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-[var(--color-text-primary)] tracking-tighter">Rs. {payment.amount}</p>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {payment.payment_method === 'online' ? <CreditCard size={14} className="text-purple-500" /> : <DollarSign size={14} className="text-emerald-500" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{payment.payment_method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.1em]",
                        payment.status === 'pending' && "bg-orange-500/10 text-orange-500",
                        payment.status === 'confirmed' && "bg-green-500/10 text-green-500",
                        payment.status === 'rejected' && "bg-red-500/10 text-red-500",
                      )}>
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          payment.status === 'pending' && "bg-orange-500",
                          payment.status === 'confirmed' && "bg-green-500",
                          payment.status === 'rejected' && "bg-red-500",
                        )} />
                        {payment.status}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase">{format(new Date(payment.created_at), 'MMM dd, yyyy')}</p>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setSelectedPayment(payment)}
                          className="p-2.5 rounded-xl bg-[var(--color-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {payment.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleConfirm(payment.id)}
                              disabled={confirmPayment.isPending}
                              className="p-2.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                              title="Confirm Payment"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedPayment(payment);
                                setShowRejectModal(true);
                              }}
                              className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                              title="Reject Payment"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <AlertCircle size={48} className="text-[var(--color-muted)]" />
                      <p className="text-[var(--color-text-secondary)] font-black uppercase tracking-widest text-xs">No payments found matching your search</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedPayment && !showRejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPayment(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[var(--color-bg-card)] rounded-[2rem] border-2 border-[var(--color-border)] shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center">
                      <DollarSign size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)]">Payment Details</h3>
                      <p className="text-[var(--color-text-secondary)] text-[10px] font-black uppercase tracking-widest">Transaction Info</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedPayment(null)} className="p-3 rounded-2xl hover:bg-[var(--color-muted)] transition-colors">
                    <XCircle size={24} className="text-[var(--color-text-secondary)]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Student</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-black text-xs">
                          {selectedPayment.student_name?.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedPayment.student_name}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Course</p>
                      <div className="flex items-center gap-3">
                        <BookOpen size={16} className="text-[var(--color-primary)]" />
                        <p className="text-sm font-bold text-[var(--color-text-primary)]">{selectedPayment.course_title}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Payment Method</p>
                      <p className="text-sm font-black uppercase tracking-widest text-[var(--color-primary)]">{selectedPayment.payment_method}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Amount</p>
                      <p className="text-2xl font-black text-[var(--color-text-primary)] tracking-tighter">Rs. {selectedPayment.amount}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Transaction ID</p>
                      <p className="text-sm font-mono font-bold text-[var(--color-text-primary)]">{selectedPayment.transaction_id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">Status</p>
                      <div className={cn(
                        "inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em]",
                        selectedPayment.status === 'pending' && "bg-orange-500/10 text-orange-500",
                        selectedPayment.status === 'confirmed' && "bg-green-500/10 text-green-500",
                        selectedPayment.status === 'rejected' && "bg-red-500/10 text-red-500",
                      )}>
                        {selectedPayment.status}
                      </div>
                    </div>
                  </div>
                </div>

                {selectedPayment.status === 'confirmed' && selectedPayment.confirmed_by_name && (
                  <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 mb-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-600">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-green-600">Verified By</p>
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">{selectedPayment.confirmed_by_name}</p>
                    </div>
                  </div>
                )}

                {selectedPayment.status === 'rejected' && (
                  <div className="p-6 rounded-2xl bg-red-500/5 border-2 border-red-500/20 mb-8">
                    <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-2 flex items-center gap-2">
                      <AlertCircle size={12} /> Rejection Reason
                    </p>
                    <p className="text-sm font-medium text-[var(--color-text-primary)] italic">&quot;{selectedPayment.rejection_reason}&quot;</p>
                  </div>
                )}

                {selectedPayment.status === 'pending' && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleConfirm(selectedPayment.id)}
                      disabled={confirmPayment.isPending}
                      className="flex-1 py-4 bg-green-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-500/30 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <CheckCircle size={20} /> Confirm & Enroll
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      className="px-8 py-4 bg-red-500/10 text-red-500 border-2 border-red-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-[var(--color-bg-card)] rounded-[2rem] border-2 border-[var(--color-border)] shadow-2xl p-8"
            >
              <h3 className="text-2xl font-black tracking-tight text-[var(--color-text-primary)] mb-2 uppercase">Reject Payment</h3>
              <p className="text-[var(--color-text-secondary)] text-sm font-medium mb-6">Please provide a reason for rejecting this payment. The student will be notified.</p>
              
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Example: Transaction ID not found, Amount mismatch..."
                className="w-full h-32 p-4 bg-[var(--color-muted)]/30 border-2 border-[var(--color-border)] rounded-2xl focus:outline-none focus:border-red-500 transition-all text-sm font-medium mb-6 resize-none"
              />
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-4 bg-[var(--color-muted)] text-[var(--color-text-secondary)] rounded-2xl font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={!rejectionReason || rejectPayment.isPending}
                  className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/30 disabled:opacity-50"
                >
                  {rejectPayment.isPending ? 'Rejecting...' : 'Reject Now'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
