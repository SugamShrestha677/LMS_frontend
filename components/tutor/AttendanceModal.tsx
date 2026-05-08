'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Users, CheckCircle2, XCircle, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAttendanceReport, useMarkAttendance } from '@/lib/hooks/useLiveSessions';
import { cn } from '@/lib/utils';

interface AttendanceModalProps {
  courseId: number;
  session: any;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'present', label: 'Present', color: 'bg-green-500 text-white', lightColor: 'bg-green-50 border-green-300 text-green-700' },
  { value: 'absent', label: 'Absent', color: 'bg-red-500 text-white', lightColor: 'bg-red-50 border-red-300 text-red-700' },
  { value: 'late', label: 'Late', color: 'bg-amber-500 text-white', lightColor: 'bg-amber-50 border-amber-300 text-amber-700' },
  { value: 'excused', label: 'Excused', color: 'bg-blue-500 text-white', lightColor: 'bg-blue-50 border-blue-300 text-blue-700' },
];

export function AttendanceModal({ courseId, session, onClose }: AttendanceModalProps) {
  const { data: reportData, isLoading } = useAttendanceReport(courseId, session.id);
  const { mutate: markAttendance, isPending } = useMarkAttendance();
  const report: any[] = (reportData as any)?.report || [];

  const [attendance, setAttendance] = useState<Record<number, { status: string; notes: string }>>({});

  useEffect(() => {
    if (report.length > 0) {
      const initial: Record<number, { status: string; notes: string }> = {};
      report.forEach((r) => {
        initial[r.student_id] = {
          status: r.status === 'not_marked' ? 'absent' : r.status,
          notes: r.notes || '',
        };
      });
      setAttendance(initial);
    }
  }, [reportData]);

  const setStatus = (studentId: number, status: string) => {
    setAttendance((prev) => ({ ...prev, [studentId]: { ...(prev[studentId] || { notes: '' }), status } }));
  };

  const markAll = (status: string) => {
    const next: Record<number, { status: string; notes: string }> = {};
    report.forEach((r) => { next[r.student_id] = { status, notes: attendance[r.student_id]?.notes || '' }; });
    setAttendance(next);
  };

  const handleSave = () => {
    const records = Object.entries(attendance).map(([student_id, data]) => ({
      student_id: Number(student_id),
      status: data.status,
      notes: data.notes,
    }));
    markAttendance({ courseId, sessionId: session.id, records }, { onSuccess: onClose });
  };

  const counts = {
    present: Object.values(attendance).filter((a) => a.status === 'present').length,
    absent: Object.values(attendance).filter((a) => a.status === 'absent').length,
    late: Object.values(attendance).filter((a) => a.status === 'late').length,
    excused: Object.values(attendance).filter((a) => a.status === 'excused').length,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
        className="relative bg-[var(--color-bg-card)] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col z-10">
        {/* Header */}
        <div className="p-6 border-b border-[var(--color-border)] flex items-start justify-between">
          <div>
            <h2 className="text-xl font-black text-[var(--color-text-primary)]">Mark Attendance</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
              Day {session.day_number} — {session.title}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-[var(--color-muted)] text-[var(--color-text-secondary)] transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Summary bar */}
        <div className="px-6 py-3 border-b border-[var(--color-border)] flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-[var(--color-text-secondary)]">Bulk mark:</span>
          {STATUS_OPTIONS.map((opt) => (
            <button key={opt.value} onClick={() => markAll(opt.value)}
              className={cn("text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors", opt.lightColor)}>
              All {opt.label}
            </button>
          ))}
          <div className="ml-auto flex gap-3 text-xs">
            <span className="text-green-600 font-bold">✓ {counts.present}</span>
            <span className="text-red-600 font-bold">✗ {counts.absent}</span>
            <span className="text-amber-600 font-bold">⏱ {counts.late}</span>
            <span className="text-blue-600 font-bold">E {counts.excused}</span>
          </div>
        </div>

        {/* Student list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : report.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">
              <Users size={40} className="mx-auto mb-3 opacity-30" />
              <p>No students enrolled yet.</p>
            </div>
          ) : (
            report.map((student) => {
              const current = attendance[student.student_id] || { status: 'absent', notes: '' };
              return (
                <div key={student.student_id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-[var(--color-muted)]/50 transition-colors">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center font-bold text-[var(--color-primary)] text-sm shrink-0">
                    {student.student_name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-[var(--color-text-primary)]">{student.student_name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{student.student_email}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {STATUS_OPTIONS.map((opt) => (
                      <button key={opt.value} onClick={() => setStatus(student.student_id, opt.value)}
                        className={cn(
                          "text-[10px] font-black px-2.5 py-1.5 rounded-lg border transition-all",
                          current.status === opt.value ? opt.color + ' border-transparent shadow-sm scale-105' : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:' + opt.lightColor
                        )}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--color-border)] flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button className="flex-1" onClick={handleSave} disabled={isPending || report.length === 0}>
            {isPending ? 'Saving...' : `Save Attendance (${report.length} students)`}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
