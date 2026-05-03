'use client';

import { useAdminDashboard } from '@/lib/hooks/useAdminData';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { 
  Users, Building2, GraduationCap, ShieldAlert,
  BarChart2, TrendingUp, AlertTriangle, CheckCircle2,
  Bell, ArrowUpRight, Search, MoreHorizontal
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';

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

  const pendingApprovals = dashboard?.pending_approvals ?? [
    { id: 1, name: 'Meta Nepal', type: 'Company', date: '2024-04-29' },
    { id: 2, name: 'Everest Tech', type: 'Company', date: '2024-04-28' },
    { id: 3, name: 'Dr. Rabin KC', type: 'Tutor', date: '2024-04-27' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E2A]">System <span className="text-gradient">Overview</span></h1>
          <p className="text-[#5A5A6E] mt-1">Platform analytics and administrative controls.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 bg-white">
            <BarChart2 size={18} className="mr-2" /> Export Report
          </Button>
          <Button className="h-11">
            <ShieldAlert size={18} className="mr-2" /> Security Audit
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={dashboard?.stats?.total_students ?? '12,450'}
          icon={<Users size={20} />}
          change="8% growth"
          changePositive={true}
          color="#0A5C4A"
        />
        <StatCard
          title="Partner Companies"
          value={dashboard?.stats?.total_companies ?? '580'}
          icon={<Building2 size={20} />}
          change="12 added this week"
          changePositive={true}
          color="#1E88E5"
        />
        <StatCard
          title="Courses Active"
          value={dashboard?.stats?.total_courses ?? '142'}
          icon={<GraduationCap size={20} />}
          change="95% completion rate"
          changePositive={true}
          color="#F5A623"
        />
        <StatCard
          title="Monthly Revenue"
          value={dashboard?.stats?.revenue ?? 'रू 8.2M'}
          icon={<TrendingUp size={20} />}
          change="15% increase"
          changePositive={true}
          color="#7C3AED"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Growth Chart */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-[#1E1E2A]">Platform Growth</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#0A5C4A]" />
                <span className="text-xs font-bold text-[#5A5A6E]">Students</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#1E88E5]" />
                <span className="text-xs font-bold text-[#5A5A6E]">Companies</span>
              </div>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A5A6E', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#5A5A6E', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Bar dataKey="students" fill="#0A5C4A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="companies" fill="#1E88E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sector Distribution */}
        <Card className="p-6">
          <h3 className="font-bold text-lg text-[#1E1E2A] mb-8">Course Sectors</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-3">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm font-medium text-[#5A5A6E]">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-[#1E1E2A]">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Alerts & Pending Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Alerts Panel */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[#1E1E2A]">
              <Bell size={20} className="text-red-500" />
              <h3 className="font-bold text-lg">System Alerts</h3>
            </div>
            <Badge variant="danger" size="sm" pulse>4 Action Required</Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-red-50 border border-red-100 highlight-animation">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0">
                <ShieldAlert size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-900">Failed Verification Attempt</p>
                <p className="text-xs text-red-700 mt-1">Multiple OTP failures detected for user ram@mail.com (IP: 192.168.1.1)</p>
                <div className="mt-3 flex gap-2">
                  <button className="text-[10px] font-black uppercase text-red-700 hover:underline">Block IP</button>
                  <button className="text-[10px] font-black uppercase text-red-700 hover:underline">Review User</button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">High Server Load</p>
                <p className="text-xs text-amber-700 mt-1">CPU usage exceeded 90% for more than 5 minutes on Primary Node.</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-[#1E1E2A]">
              <CheckCircle2 size={20} className="text-[#0A5C4A]" />
              <h3 className="font-bold text-lg">Pending Approvals</h3>
            </div>
            <button className="text-xs font-bold text-[#0A5C4A] hover:underline">View Queue</button>
          </div>

          <div className="space-y-3">
            {pendingApprovals.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-[#e5e7eb] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-[#5A5A6E]">
                    {item.type === 'Company' ? <Building2 size={18} /> : <Users size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#1E1E2A]">{item.name}</p>
                    <p className="text-[10px] text-[#5A5A6E] font-medium">{item.type} • Requested 2h ago</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal size={14} />
                  </Button>
                  <Button variant="primary" size="sm" className="h-8 px-3 text-[10px] uppercase font-black tracking-tight">
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
