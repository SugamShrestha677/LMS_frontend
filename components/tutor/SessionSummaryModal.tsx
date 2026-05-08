'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Youtube, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAddSessionSummary } from '@/lib/hooks/useLiveSessions';

interface SessionSummaryModalProps {
  courseId: number;
  session: any;
  onClose: () => void;
}

export function SessionSummaryModal({ courseId, session, onClose }: SessionSummaryModalProps) {
  const { mutate: addSummary, isPending } = useAddSessionSummary();
  const [form, setForm] = useState({
    summary: session.summary || '',
    topics_covered: session.topics_covered || '',
    homework: session.homework || '',
    recording_link: session.recording_link || '',
    teaching_notes: session.tutor_note?.teaching_notes || '',
    performance_observations: session.tutor_note?.performance_observations || '',
    next_session_prep: session.tutor_note?.next_session_prep || '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const inputCls = "w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 text-sm resize-none";
  const labelCls = "block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1.5";

  const handleSave = () => {
    addSummary({ courseId, sessionId: session.id, data: form }, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative bg-[var(--color-bg-card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-[var(--color-text-primary)]">Session Summary</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Day {session.day_number} — {session.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-muted)] text-[var(--color-text-secondary)] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Student-visible section */}
          <div className="space-y-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-primary)]">📢 Visible to Students</p>
            <div>
              <label className={labelCls}>Class Summary</label>
              <textarea rows={4} className={inputCls} placeholder="What was covered in this session..." value={form.summary} onChange={e => set('summary', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Topics Covered</label>
              <textarea rows={3} className={inputCls} placeholder="- React Hooks\n- useState, useEffect..." value={form.topics_covered} onChange={e => set('topics_covered', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Homework / Assignment</label>
              <textarea rows={3} className={inputCls} placeholder="Build a simple counter app using useState..." value={form.homework} onChange={e => set('homework', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Recording Link (YouTube / Google Drive)</label>
              <input type="url" className={inputCls} placeholder="https://youtube.com/..." value={form.recording_link} onChange={e => set('recording_link', e.target.value)} />
            </div>
          </div>

          {/* Private tutor notes */}
          <div className="space-y-4 p-4 rounded-2xl border border-violet-200 bg-violet-50/30">
            <p className="text-[10px] font-black uppercase tracking-widest text-violet-600">🔒 Private Tutor Notes (not visible to students)</p>
            <div>
              <label className={labelCls}>Teaching Notes</label>
              <textarea rows={3} className={inputCls} placeholder="Internal notes about how the session went..." value={form.teaching_notes} onChange={e => set('teaching_notes', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Student Performance Observations</label>
              <textarea rows={3} className={inputCls} placeholder="Ali is struggling with closures, Rima grasped concepts quickly..." value={form.performance_observations} onChange={e => set('performance_observations', e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Next Session Preparation</label>
              <textarea rows={2} className={inputCls} placeholder="Prepare exercises on useEffect, add 3 coding challenges..." value={form.next_session_prep} onChange={e => set('next_session_prep', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-[var(--color-border)] flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={isPending}>
            {isPending ? 'Publishing...' : 'Publish Summary'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
