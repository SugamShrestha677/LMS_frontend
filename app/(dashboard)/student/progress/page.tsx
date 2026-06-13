'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Clock, BookOpen, Award, Target, Calendar, ChevronRight, Activity, Zap } from 'lucide-react';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, ProgressBar } from '@/components/ui/Badge';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function ProgressPage() {
  const { data: progressData, isLoading, error } = useQuery({
    queryKey: ['student', 'progress'],
    queryFn: () => studentApi.getProgress(),
  });

  if (isLoading) {
    return (
      <div className="space-y-10 pb-12">
        <Skeleton className="h-20 w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <Skeleton className="h-[400px]" />
            <Skeleton className="h-[300px]" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[300px]" />
            <Skeleton className="h-[250px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center py-20 text-red-500">
        Error loading progress data. Please try again later.
      </div>
    );
  }

  const { stats, activity_data, skill_data, learning_path, velocity } = progressData;

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm">Analytical Overview</Badge>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Growth Metrics</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Detailed visualization of your academic evolution and performance.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Engagement"
          value={stats?.total_engagement || '0h'}
          icon={<Clock size={22} />}
          change="+12% from last month"
          changePositive={true}
          color="var(--color-primary)"
        />
        <StatCard
          title="Accreditations"
          value={stats?.accreditations || '0'}
          icon={<BookOpen size={22} />}
          change="+1 this month"
          changePositive={true}
          color="#1E88E5"
        />
        <StatCard
          title="Skill Points"
          value={stats?.skill_points || '0'}
          icon={<Target size={22} />}
          change="+450 XP earned"
          changePositive={true}
          color="#F5A623"
        />
        <StatCard
          title="Global Standing"
          value={stats?.rank || 'N/A'}
          icon={<Award size={22} />}
          change={stats?.global_standing || 'Unranked'}
          changePositive={true}
          color="#7C3AED"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Technical Proficiency</h3>
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Learning intensity over time</p>
              </div>
              <select className="text-[10px] font-black bg-[var(--color-muted)] text-[var(--color-text-primary)] border-[var(--color-border)] rounded-xl px-4 py-2 outline-none cursor-pointer uppercase tracking-widest">
                <option>Last 6 Months</option>
                <option>This Year</option>
              </select>
            </div>
            <div className="h-[340px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activity_data || []}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--color-border)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }} dy={15} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }} />
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
                  <Area type="monotone" dataKey="hours" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-10 tracking-tight flex items-center gap-3">
              <Activity size={22} className="text-[var(--color-primary)]" /> Curriculum Roadmap
            </h3>
            <div className="space-y-8">
              {!learning_path || learning_path.length === 0 ? (
                <div className="text-center py-10 text-[var(--color-text-secondary)]">No enrolled courses yet.</div>
              ) : (
                learning_path.map((item: any, idx: number) => (
                  <div key={item.id} className="relative">
                    {idx !== learning_path.length - 1 && (
                      <div className="absolute left-[21px] top-12 bottom-[-32px] w-1 bg-[var(--color-border)] rounded-full" />
                    )}
                    <div className="flex gap-8">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 z-10 border-4 border-[var(--color-bg-card)] ${
                        item.progress === 100 
                          ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' 
                          : item.progress > 0 
                          ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' 
                          : 'bg-[var(--color-muted)] text-[var(--color-text-secondary)]'
                      }`}>
                        {item.progress === 100 ? <Award size={24} /> : <BookOpen size={24} />}
                      </div>
                      <div className="flex-1 pb-10">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                          <div>
                            <h4 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">{item.title}</h4>
                            <p className="text-[10px] font-black text-[var(--color-text-secondary)] flex items-center gap-2 mt-1 uppercase tracking-widest">
                              <Calendar size={12} className="text-[var(--color-primary)]" /> {item.date}
                            </p>
                          </div>
                          <Badge variant={item.progress === 100 ? 'success' : item.progress > 0 ? 'primary' : 'secondary'} size="sm">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4">
                          <ProgressBar value={item.progress} className="flex-1 h-3" color={item.progress === 100 ? 'var(--color-success)' : 'var(--color-primary)'} />
                          <span className="text-xs font-mono font-black text-[var(--color-text-primary)] min-w-[40px]">{Math.round(item.progress)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8 tracking-tight">Competency Matrix</h3>
            <div className="space-y-8">
              {!skill_data || skill_data.length === 0 ? (
                 <div className="text-[var(--color-text-secondary)] text-sm">No skill data available. Enroll in courses to build competencies.</div>
              ) : (
                skill_data.map((skill: any) => (
                  <div key={skill.subject}>
                    <div className="flex justify-between text-[10px] font-black mb-2 uppercase tracking-widest">
                      <span className="text-[var(--color-text-secondary)]">{skill.subject}</span>
                      <span style={{ color: skill.color }}>{skill.score}%</span>
                    </div>
                    <ProgressBar value={skill.score} color={skill.color} className="h-2.5" />
                  </div>
                ))
              )}
            </div>
            <Button variant="outline" fullWidth size="lg" className="mt-10 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2">
              Generate PDF Report <ChevronRight size={16} />
            </Button>
          </Card>

          <Card className="p-8 bg-amber-500/[0.03] border-dashed border-2 border-amber-500/20">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Velocity Goal</h3>
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Weekly Commitment</p>
              </div>
            </div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-8 leading-relaxed">
              You&apos;ve logged <span className="font-black text-amber-600">{velocity?.logged_hours || 0} technical hours</span> this week. Complete <span className="text-[var(--color-text-primary)] font-black">{Math.max(0, (velocity?.target_hours || 15) - (velocity?.logged_hours || 0))} more</span> to achieve your milestone.
            </p>
            <div className="mb-10">
              <div className="flex justify-between text-[10px] font-black mb-2 text-amber-600 uppercase tracking-widest">
                <span>Threshold Progress</span>
                <span>{velocity?.progress_percentage || 0}%</span>
              </div>
              <ProgressBar value={velocity?.progress_percentage || 0} color="#F5A623" className="h-3" />
            </div>
            <Button variant="primary" fullWidth size="lg" className="bg-amber-500 hover:bg-amber-600 border-none shadow-lg shadow-amber-500/20">
              Optimize Schedule
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
