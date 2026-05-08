'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  Radio, Plus, Calendar, Clock, Users, CheckCircle, ChevronRight,
  ExternalLink, Edit3, Trash2, ClipboardList, FileText, BarChart2, X, Wifi
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useLiveSessions, useCreateLiveSession, useDeleteLiveSession, useUpdateLiveSession } from '@/lib/hooks/useLiveSessions';
import { useCourse } from '@/lib/hooks/useCourses';
import { AttendanceModal } from '@/components/tutor/AttendanceModal';
import { SessionSummaryModal } from '@/components/tutor/SessionSummaryModal';

export default function TutorLiveSessionsPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const { data: course } = useCourse(courseId);
  const { data: sessionsData } = useLiveSessions(courseId);
  const sessions: any[] = Array.isArray(sessionsData) ? sessionsData : (sessionsData as any)?.data || [];

  const { mutate: createSession, isPending: creating } = useCreateLiveSession();
  const { mutate: deleteSession } = useDeleteLiveSession();
  const { mutate: updateSession } = useUpdateLiveSession();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [attendanceSession, setAttendanceSession] = useState<any>(null);
  const [summarySession, setSummarySession] = useState<any>(null);
  const [editSession, setEditSession] = useState<any>(null);

  const [form, setForm] = useState({
    title: '', day_number: '', date: '', start_time: '', end_time: '', meet_link: '',
  });

  const handleCreate = () => {
    createSession(
      { courseId, data: { ...form, day_number: Number(form.day_number) } },
      { onSuccess: () => { setShowCreateModal(false); setForm({ title: '', day_number: '', date: '', start_time: '', end_time: '', meet_link: '' }); } }
    );
  };

  const handleDelete = (sessionId: number) => {
    if (confirm('Delete this session?')) {
      deleteSession({ courseId, sessionId });
    }
  };

  const nextDayNumber = sessions.length > 0 ? Math.max(...sessions.map((s) => s.day_number)) + 1 : 1;

  const statusColors: Record<string, string> = {
    active: 'bg-red-500/10 text-red-600 border-red-200',
    completed: 'bg-green-500/10 text-green-600 border-green-200',
    upcoming: 'bg-blue-500/10 text-blue-600 border-blue-200',
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] p-6 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-violet-500/10 rounded-xl flex items-center justify-center">
              <Radio size={20} className="text-violet-600" />
            </div>
            <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Live Sessions</h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm pl-13">{course?.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.location.href = `/tutor/courses/${courseId}/live-sessions/analytics`}>
            <BarChart2 size={16} /> Analytics
          </Button>
          <Button onClick={() => { setForm(f => ({ ...f, day_number: String(nextDayNumber) })); setShowCreateModal(true); }}>
            <Plus size={16} /> Schedule Session
          </Button>
        </div>
      </div>

      {/* Sessions Grid */}
      {sessions.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Radio size={36} className="text-violet-400" />
          </div>
          <h3 className="font-bold text-xl text-[var(--color-text-primary)] mb-2">No live sessions scheduled yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6">Create the first session for this course.</p>
          <Button onClick={() => setShowCreateModal(true)}><Plus size={16} /> Schedule First Session</Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <Card key={session.id} className="p-0 overflow-hidden">
              <div className="flex items-stretch">
                {/* Day block */}
                <div className={cn(
                  "w-20 flex flex-col items-center justify-center shrink-0 font-black border-r border-[var(--color-border)]",
                  session.status === 'active' ? "bg-red-500 text-white" :
                  session.status === 'completed' ? "bg-green-500 text-white" : "bg-[var(--color-muted)] text-[var(--color-text-secondary)]"
                )}>
                  <span className="text-[9px] uppercase tracking-widest">Day</span>
                  <span className="text-3xl leading-none">{session.day_number}</span>
                </div>
                <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-bold text-[var(--color-text-primary)]">{session.title}</h3>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border", statusColors[session.status] || statusColors.upcoming)}>
                        {session.status === 'active' ? '🔴 Live Now' : session.status}
                      </span>
                      {session.is_completed && <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">✓ Summary Published</span>}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1"><Calendar size={12} /> {session.date ? format(parseISO(session.date), 'MMM dd, yyyy') : '—'}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {session.start_time?.slice(0,5)} – {session.end_time?.slice(0,5)}</span>
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        P:{session.attendance_count?.present || 0} / A:{session.attendance_count?.absent || 0} / L:{session.attendance_count?.late || 0}
                      </span>
                    </div>
                    {session.meet_link && (
                      <a href={session.meet_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[var(--color-primary)] hover:underline mt-1">
                        <Wifi size={11} /> {session.meet_link.slice(0, 40)}...
                      </a>
                    )}
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {session.status === 'active' && session.meet_link && (
                      <a href={session.meet_link} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-red-500/20">
                        <Wifi size={14} /> Start Class
                      </a>
                    )}
                    <button onClick={() => setAttendanceSession(session)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-xl text-xs font-bold hover:bg-[var(--color-primary)]/20 transition-colors">
                      <ClipboardList size={13} /> Attendance
                    </button>
                    <button onClick={() => setSummarySession(session)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-violet-500/10 text-violet-600 rounded-xl text-xs font-bold hover:bg-violet-500/20 transition-colors">
                      <FileText size={13} /> Summary
                    </button>
                    <button onClick={() => setEditSession(session)}
                      className="p-2 rounded-xl text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-colors">
                      <Edit3 size={15} />
                    </button>
                    <button onClick={() => handleDelete(session.id)}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Session Modal */}
      <AnimatePresence>
        {(showCreateModal || editSession) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => { setShowCreateModal(false); setEditSession(null); }} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-[var(--color-bg-card)] rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-[var(--color-text-primary)]">
                  {editSession ? 'Edit Session' : 'Schedule Live Session'}
                </h2>
                <button onClick={() => { setShowCreateModal(false); setEditSession(null); }}
                  className="p-2 rounded-xl hover:bg-[var(--color-muted)] text-[var(--color-text-secondary)] transition-colors">
                  <X size={20} />
                </button>
              </div>
              <SessionForm
                initialData={editSession || { ...form, day_number: String(nextDayNumber) }}
                onSubmit={(data: any) => {
                  if (editSession) {
                    updateSession({ courseId, sessionId: editSession.id, data }, { onSuccess: () => setEditSession(null) });
                  } else {
                    createSession({ courseId, data: { ...data, day_number: Number(data.day_number) } }, {
                      onSuccess: () => { setShowCreateModal(false); setForm({ title: '', day_number: '', date: '', start_time: '', end_time: '', meet_link: '' }); }
                    });
                  }
                }}
                onCancel={() => { setShowCreateModal(false); setEditSession(null); }}
                isPending={creating}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Attendance Modal */}
      {attendanceSession && (
        <AttendanceModal
          courseId={courseId}
          session={attendanceSession}
          onClose={() => setAttendanceSession(null)}
        />
      )}

      {/* Summary Modal */}
      {summarySession && (
        <SessionSummaryModal
          courseId={courseId}
          session={summarySession}
          onClose={() => setSummarySession(null)}
        />
      )}
    </div>
  );
}

function SessionForm({ initialData, onSubmit, onCancel, isPending }: any) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    day_number: String(initialData?.day_number || ''),
    date: initialData?.date || '',
    start_time: initialData?.start_time?.slice(0, 5) || '',
    end_time: initialData?.end_time?.slice(0, 5) || '',
    meet_link: initialData?.meet_link || '',
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const inputCls = "w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 text-sm";
  const labelCls = "block text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-1.5";
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Day Number</label>
          <input type="number" className={inputCls} value={form.day_number} onChange={e => set('day_number', e.target.value)} min={1} />
        </div>
        <div>
          <label className={labelCls}>Date</label>
          <input type="date" className={inputCls} value={form.date} onChange={e => set('date', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Session Title</label>
        <input type="text" className={inputCls} placeholder="Introduction to React Hooks" value={form.title} onChange={e => set('title', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Start Time</label>
          <input type="time" className={inputCls} value={form.start_time} onChange={e => set('start_time', e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>End Time</label>
          <input type="time" className={inputCls} value={form.end_time} onChange={e => set('end_time', e.target.value)} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Google Meet Link (optional)</label>
        <input type="url" className={inputCls} placeholder="https://meet.google.com/xxx-yyyy-zzz" value={form.meet_link} onChange={e => set('meet_link', e.target.value)} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1" onClick={() => onSubmit(form)} disabled={isPending || !form.title || !form.date}>
          {isPending ? 'Saving...' : initialData?.id ? 'Update Session' : 'Schedule Session'}
        </Button>
      </div>
    </div>
  );
}
