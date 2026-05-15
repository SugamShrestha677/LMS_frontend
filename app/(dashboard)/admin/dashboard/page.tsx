'use client';

import { useAdminDashboard } from '@/lib/hooks/useAdminData';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { Bar as BarType } from 'recharts';
import { Button } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { 
  Users, Building2, GraduationCap, ShieldAlert,
  BarChart2, TrendingUp, AlertTriangle, CheckCircle2,
  Bell, ArrowUpRight, Search, MoreHorizontal,
  XCircle
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Recharts with SSR disabled for performance
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(
  () => import('recharts').then(mod => mod.Bar as any),
  { ssr: false }
);
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const Cell = dynamic(() => import('recharts').then(mod => mod.Cell), { ssr: false });
const PieChart = dynamic(() => import('recharts').then(mod => mod.PieChart), { ssr: false });
const Pie = dynamic(() => import('recharts').then(mod => mod.Pie), { ssr: false });

export default function AdminDashboard() {
  const { data: dashboard, isLoading } = useAdminDashboard();

  if (isLoading) return <DashboardSkeleton />;

  const growthData = dashboard?.growth_data ?? [
    { name: 'Jan', students: 400, companies: 240 },
    { name: 'Feb', students: 600, companies: 300 },
    { name: 'Mar', students: 800, companies: 450 },
    { name: 'Apr', students: 1100, companies: 600 },
  ];

  const distributionData = [
    { name: 'Engineering', value: 45, color: '#0A5C4A' },
    { name: 'Design', value: 25, color: '#F5A623' },
    { name: 'Management', value: 20, color: '#1E88E5' },
    { name: 'Other', value: 10, color: '#7C3AED' },
  ];

  type PendingApproval = {
    id: number;
    name: string;
    type: string;
    date: string;
  };

  const pendingApprovals: PendingApproval[] = dashboard?.pending_approvals ?? [
    { id: 1, name: 'Meta Nepal', type: 'Company', date: '2024-04-29' },
    { id: 2, name: 'Everest Tech', type: 'Company', date: '2024-04-28' },
    { id: 3, name: 'Dr. Rabin KC', type: 'Tutor', date: '2024-04-27' },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            System <span className="text-[var(--color-primary)]">Intelligence</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Real-time analytics and administrative oversight for Leapfrog Connect.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-14 px-6 rounded-2xl bg-[var(--color-bg-card)]/50 border-[var(--color-border)] font-black text-xs uppercase tracking-widest">
            <BarChart2 size={18} className="mr-2" /> Export Report
          </Button>
          <Button className="h-14 px-6 rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 font-black text-xs uppercase tracking-widest">
            <ShieldAlert size={18} className="mr-2" /> Security Audit
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Talent Pool"
          value={dashboard?.stats?.total_students ?? '12,450'}
          icon={<Users size={22} />}
          change="8.4% monthly growth"
          changePositive={true}
          color="#0A5C4A"
        />
        <StatCard
          title="Enterprise Partners"
          value={dashboard?.stats?.total_companies ?? '582'}
          icon={<Building2 size={22} />}
          change="12 added this week"
          changePositive={true}
          color="#1E88E5"
        />
        <StatCard
          title="Active Curriculums"
          value={dashboard?.stats?.total_courses ?? '142'}
          icon={<GraduationCap size={22} />}
          change="95% completion rate"
          changePositive={true}
          color="#F5A623"
        />
        <StatCard
          title="System Revenue"
          value={dashboard?.stats?.revenue ?? 'रू 8.2M'}
          icon={<TrendingUp size={22} />}
          change="15.2% increase"
          changePositive={true}
          color="#7C3AED"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Growth Chart */}
        <Card className="lg:col-span-2 p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
            <div>
              <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Growth Trajectory</h3>
              <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Acquisition Trends</p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_rgba(10,92,74,0.4)]" />
                <span className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-tighter">Students</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#1E88E5] shadow-[0_0_8px_rgba(30,136,229,0.4)]" />
                <span className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-tighter">Companies</span>
              </div>
            </div>
          </div>
          <div className="h-[380px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.03)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--color-text-secondary)', fontSize: 11, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    borderRadius: '20px', 
                    border: '1px solid rgba(255,255,255,0.6)', 
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255,255,255,0.8)'
                  }} 
                />
                <Bar dataKey="students" fill="var(--color-primary)" radius={[6, 6, 0, 0]} barSize={32} />
                <Bar dataKey="companies" fill="#1E88E5" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sector Distribution */}
        <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem]">
          <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight mb-2">Curriculum Focus</h3>
          <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mb-8">Sector Distribution</p>
          
          <div className="h-[240px] w-full relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-3xl font-black text-[var(--color-text-primary)]">142</p>
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Total</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.color} 
                      className="outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8 space-y-4">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full transition-transform group-hover:scale-125" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">{item.name}</span>
                </div>
                <span className="text-sm font-black text-[var(--color-text-primary)]">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts & Pending Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Alerts Panel */}
        <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-[var(--color-text-primary)]">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                <Bell size={20} />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">System Alerts</h3>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">4 Critical Actions</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-xl bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-white transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-5 rounded-3xl bg-red-500/[0.03] border border-red-500/10 group hover:bg-red-500/[0.05] transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShieldAlert size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-red-900 uppercase tracking-tight">Security Breach Attempt</p>
                <p className="text-xs text-red-700/70 mt-1 font-medium leading-relaxed">Multiple OTP failures detected for account <span className="font-bold underline">ram@mail.com</span> from restricted IP range.</p>
                <div className="mt-4 flex gap-3">
                  <button className="px-4 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">Block IP</button>
                  <button className="px-4 py-2 rounded-xl bg-white border border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-colors">Review Logs</button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-3xl bg-amber-500/[0.03] border border-amber-500/10">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-amber-900 uppercase tracking-tight">Server Threshold Reached</p>
                <p className="text-xs text-amber-700/70 mt-1 font-medium leading-relaxed">Primary production node is currently at 92% CPU capacity. Scale-out recommended.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-xl border-none shadow-2xl rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3 text-[var(--color-text-primary)]">
              <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-black text-xl tracking-tight">Pending Approvals</h3>
                <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest">Verification Queue</p>
              </div>
            </div>
            <button className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {pendingApprovals.map((item: PendingApproval) => (
              <div key={item.id} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-[var(--color-bg-card)]/50 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 transition-all hover:shadow-lg hover:shadow-[var(--color-primary)]/5 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-colors">
                    {item.type === 'Company' ? <Building2 size={22} /> : <Users size={22} />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--color-text-primary)]">{item.name}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest mt-0.5">{item.type} • New Application</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-xl hover:bg-red-50 hover:text-red-500">
                    <XCircle size={18} />
                  </Button>
                  <Button className="h-10 px-5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/10">
                    Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
