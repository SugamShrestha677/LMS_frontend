'use client';

import { useStudentDashboard } from '@/lib/hooks/useStudentData';
import { useAuthStore } from '@/lib/store/authStore';
import { StatCard } from '@/components/ui/Card';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Badge';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { 
  BookOpen, Award, TrendingUp, Clock, AlertCircle, 
  ChevronRight, Calendar, Star, FileText 
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const { data: dashboard, isLoading } = useStudentDashboard();

  if (isLoading) return <DashboardSkeleton />;

  // Mock data if API is empty for demonstration
  const chartData = dashboard?.activity_data ?? [
    { name: 'Mon', hours: 2 },
    { name: 'Tue', hours: 4 },
    { name: 'Wed', hours: 3 },
    { name: 'Thu', hours: 5 },
    { name: 'Fri', hours: 2 },
    { name: 'Sat', hours: 6 },
    { name: 'Sun', hours: 4 },
  ];

  const recentBadges = dashboard?.recent_badges ?? [
    { id: 1, name: 'Quick Learner', icon: 'Zap', date: '2024-04-20' },
    { id: 2, name: 'Python Pro', icon: 'Code', date: '2024-04-18' },
    { id: 3, name: 'Logic Master', icon: 'Brain', date: '2024-04-15' },
  ];

  const ongoingCourses = dashboard?.ongoing_courses ?? [
    { id: 101, title: 'Advanced React Patterns', progress: 65, next_lesson: 'Compound Components' },
    { id: 102, title: 'Backend with Django', progress: 40, next_lesson: 'Custom Middlewares' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-black uppercase tracking-widest">
              Student Portal
            </span>
            <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />
            <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">
              Session Active
            </span>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Namaste, <span className="text-gradient">{user?.first_name}</span>! 👋
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Here's a curated look at your learning progress today.</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-4 bg-[var(--color-bg-card)] p-3 rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] border border-[var(--color-border)]"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
            <Star size={24} className="fill-amber-500" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-black text-[var(--color-text-secondary)] tracking-widest mb-0.5">Academic Credits</p>
            <p className="text-xl font-mono font-black text-[var(--color-text-primary)] leading-none">1,250 <span className="text-xs text-[var(--color-text-secondary)] font-bold">XP</span></p>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Courses Enrolled"
          value={dashboard?.stats?.total_courses ?? 12}
          icon={<BookOpen size={22} />}
          change="2 new this month"
          changePositive={true}
          color="var(--color-primary)"
        />
        <StatCard
          title="Verified Badges"
          value={dashboard?.stats?.total_badges ?? 8}
          icon={<Award size={22} />}
          change="3 to unlock soon"
          changePositive={true}
          color="#F5A623"
        />
        <StatCard
          title="Avg. Proficiency"
          value={`${dashboard?.stats?.avg_score ?? 88}%`}
          icon={<TrendingUp size={22} />}
          change="4% increase"
          changePositive={true}
          color="#1E88E5"
        />
        <StatCard
          title="Learning Hours"
          value={dashboard?.stats?.study_hours ?? '24h'}
          icon={<Clock size={22} />}
          change="Weekly target met"
          changePositive={true}
          color="#7C3AED"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Activity Chart & Ongoing Courses */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Learning Activity</h3>
                <p className="text-xs text-[var(--color-text-secondary)] font-bold mt-1 uppercase tracking-widest">Time spent in interactive lessons</p>
              </div>
              <select className="text-[10px] font-black bg-[var(--color-muted)] text-[var(--color-text-primary)] border-[var(--color-border)] rounded-xl px-4 py-2 outline-none cursor-pointer hover:border-[var(--color-primary)] transition-colors uppercase tracking-widest">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--color-border)" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: 'var(--radius-md)', 
                      border: '1px solid var(--color-border)', 
                      backgroundColor: 'var(--color-bg-card)',
                      color: 'var(--color-text-primary)',
                      boxShadow: 'var(--shadow-lg)',
                      padding: '12px'
                    }}
                    itemStyle={{ fontWeight: 800, fontSize: '12px' }}
                    labelStyle={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="var(--color-primary)" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Active Curriculum</h3>
              <Link href="/student/courses" className="text-xs font-black text-[var(--color-primary)] hover:opacity-80 transition-opacity flex items-center gap-1 uppercase tracking-widest">
                Explore Courses <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingCourses.map((course) => (
                <Card key={course.id} hover className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <Badge variant="primary" size="sm" dot pulse>In Progress</Badge>
                    <span className="text-xs font-mono font-black text-[var(--color-primary)] bg-[var(--color-primary)]/5 px-2 py-1 rounded-md">{course.progress}%</span>
                  </div>
                  <h4 className="font-black text-lg text-[var(--color-text-primary)] mb-1 leading-tight">{course.title}</h4>
                  <p className="text-[10px] font-bold text-[var(--color-text-secondary)] mb-6 flex items-center gap-1.5 uppercase tracking-widest">
                    <Calendar size={12} className="text-[var(--color-primary)]" /> Next: {course.next_lesson}
                  </p>
                  <ProgressBar value={course.progress} className="mb-6" color="var(--color-primary)" />
                  <Button variant="primary" size="md" fullWidth>
                    Continue Journey
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Badges & Alerts */}
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8 tracking-tight">Recent Achievements</h3>
            <div className="space-y-6">
              {recentBadges.map((badge, idx) => (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-amber-500 shadow-sm group-hover:scale-110 transition-transform">
                    <Award size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-[var(--color-text-primary)]">{badge.name}</p>
                    <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5">{formatDate(badge.date)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="success" size="sm" dot>Verified</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
            <Link href="/student/badges" className="block mt-10">
              <Button variant="outline" fullWidth size="md">
                All Achievements
              </Button>
            </Link>
          </Card>

          <Card className="p-8 bg-red-500/[0.03] dark:bg-red-500/[0.05] border-red-500/10">
            <div className="flex items-center gap-3 text-red-500 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center shadow-inner">
                <AlertCircle size={22} className="pulse-ring" />
              </div>
              <h3 className="font-black text-xl tracking-tight">System Notice</h3>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-6 leading-relaxed">
              Academic deadline approaching. You have an assessment expiring in <span className="font-black text-red-500 underline decoration-2 underline-offset-4">2 days</span> for <span className="text-[var(--color-text-primary)] font-black">Advanced React Patterns</span>.
            </p>
            <Link href="/student/assessments">
              <Button variant="danger" fullWidth size="md">
                Resolve Now
              </Button>
            </Link>
          </Card>

          <Card className="p-8 border-dashed border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white shadow-lg shadow-[var(--color-primary)]/20">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Career Match</h3>
                <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">Opportunities Found</p>
              </div>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-8 leading-relaxed">
              Our algorithm identified <span className="font-black text-[var(--color-primary)]">5 exclusive job openings</span> that perfectly align with your verified skill set.
            </p>
            <Link href="/student/jobs" className="group">
              <Button variant="primary" fullWidth size="md">
                Explore Matches
              </Button>
            </Link>
          </Card>
        </div>

      </div>
    </div>
  );
}
