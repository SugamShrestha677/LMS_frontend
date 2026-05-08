'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { BarChart2, Users, TrendingDown, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { useAttendanceOverview } from '@/lib/hooks/useLiveSessions';
import { useCourse } from '@/lib/hooks/useCourses';
import { cn } from '@/lib/utils';

export default function AttendanceAnalyticsPage() {
  const params = useParams();
  const courseId = Number(params.courseId);
  const { data: course } = useCourse(courseId);
  const { data: overviewData, isLoading } = useAttendanceOverview(courseId);
  const overview: any = overviewData || {};
  const dayWise: any[] = overview.day_wise || [];
  const lowAttendance: any[] = overview.low_attendance_students || [];

  const avgPct = dayWise.length
    ? Math.round(dayWise.reduce((sum, d) => sum + d.attendance_pct, 0) / dayWise.length)
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-violet-500/10 rounded-2xl flex items-center justify-center">
          <BarChart2 size={22} className="text-violet-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Attendance Analytics</h1>
          <p className="text-sm text-[var(--color-text-secondary)]">{course?.title}</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: overview.total_sessions || 0, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
          { label: 'Enrolled Students', value: overview.total_enrolled || 0, icon: Users, color: 'text-violet-600 bg-violet-50' },
          { label: 'Avg Attendance', value: `${avgPct}%`, icon: TrendingDown, color: avgPct >= 75 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50' },
          { label: 'Low Attendance', value: lowAttendance.length, icon: XCircle, color: 'text-amber-600 bg-amber-50' },
        ].map((stat) => (
          <Card key={stat.label} className="p-5 flex items-center gap-4">
            <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--color-text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--color-text-secondary)]">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Day-wise attendance chart */}
      <Card className="p-6">
        <h2 className="font-black text-lg text-[var(--color-text-primary)] mb-6">Day-wise Attendance</h2>
        {dayWise.length === 0 ? (
          <p className="text-[var(--color-text-secondary)] text-sm text-center py-8">No session data yet.</p>
        ) : (
          <div className="space-y-3">
            {dayWise.map((day, i) => (
              <motion.div key={day.session_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4"
              >
                <div className="w-16 text-right shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Day {day.day_number}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-[var(--color-text-primary)] truncate">{day.title}</span>
                    <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-full", day.status === 'completed' ? 'bg-green-100 text-green-700' : day.status === 'active' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600')}>
                      {day.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${day.attendance_pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05 }}
                        className={cn("h-full rounded-full", day.attendance_pct >= 75 ? 'bg-green-500' : 'bg-amber-500')}
                      />
                    </div>
                    <span className="text-xs font-black w-10 text-right text-[var(--color-text-secondary)]">{day.attendance_pct}%</span>
                    <span className="text-[10px] text-[var(--color-text-secondary)] w-24 shrink-0">
                      {day.present}/{day.total_enrolled} present
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Low attendance students */}
      {lowAttendance.length > 0 && (
        <Card className="p-6">
          <h2 className="font-black text-lg text-[var(--color-text-primary)] mb-1">
            ⚠️ Low Attendance Students ({lowAttendance.length})
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-6">Students with &lt;75% attendance rate</p>
          <div className="space-y-3">
            {lowAttendance.map((student) => (
              <div key={student.student_id} className="flex items-center gap-4 p-3 rounded-xl bg-red-50/50 border border-red-100">
                <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600 text-sm shrink-0">
                  {student.student_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[var(--color-text-primary)]">{student.student_name}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{student.student_email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-black text-lg text-red-600">{student.attendance_pct}%</p>
                  <p className="text-[10px] text-[var(--color-text-secondary)]">{student.sessions_attended}/{student.total_sessions} sessions</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
