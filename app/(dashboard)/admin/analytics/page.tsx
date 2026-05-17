'use client';

import { Card } from '@/components/ui/Card';
import { BarChart2, TrendingUp, Users, Award, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const AnalyticsCharts = dynamic(() => import('./Charts'), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl h-[400px] animate-pulse" />
      <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl h-[400px] animate-pulse" />
    </div>
  ),
});

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            System <span className="text-[var(--color-primary)]">Analytics</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Comprehensive data insights and performance metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'New Registrations', value: '1,284', change: '+12.5%', pos: true, icon: Users },
          { title: 'Course Completion', value: '84%', change: '+5.2%', pos: true, icon: Award },
          { title: 'Avg. Assessment Score', value: '72/100', change: '-2.1%', pos: false, icon: BarChart2 },
          { title: 'Active Companies', value: '42', change: '+3 new', pos: true, icon: TrendingUp },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[1.5rem] border border-[var(--color-border)] shadow-lg hover:shadow-xl transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center text-[10px] font-black ${stat.pos ? 'text-emerald-600' : 'text-red-600'}`}>
                {stat.pos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {stat.change}
              </div>
            </div>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">{stat.title}</p>
            <p className="text-2xl font-black text-[var(--color-text-primary)] mt-1">{stat.value}</p>
          </Card>
        ))}
      </div>

      <AnalyticsCharts />
    </div>
  );
}
