'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { DollarSign, TrendingUp, TrendingDown, ArrowUpRight, CreditCard, Download, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Recharts with SSR disabled for performance
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });

const data = [
  { name: 'Jan', amount: 4000 },
  { name: 'Feb', amount: 3000 },
  { name: 'Mar', amount: 5000 },
  { name: 'Apr', amount: 4500 },
  { name: 'May', amount: 6000 },
  { name: 'Jun', amount: 5500 },
];

export default function FinancePage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">Finance <span className="text-[var(--color-primary)]">Control</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Revenue tracking and financial health overview</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-all flex items-center gap-2">
            <Calendar size={14} /> Last 30 Days
          </button>
          <button className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2">
            <Download size={14} /> Reports
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">NPR 8.2M</p>
          <div className="mt-4 flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase">
            <TrendingUp size={14} /> +12.5%
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Active Subs</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">2,842</p>
          <div className="mt-4 flex items-center gap-1.5 text-blue-600 text-[10px] font-black uppercase">
            <TrendingUp size={14} /> +4.2%
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Avg. Transaction</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">NPR 4.5K</p>
          <div className="mt-4 flex items-center gap-1.5 text-purple-600 text-[10px] font-black uppercase">
            <TrendingUp size={14} /> +0.8%
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Pending Payouts</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">NPR 1.1M</p>
          <div className="mt-4 flex items-center gap-1.5 text-orange-600 text-[10px] font-black uppercase">
            <Calendar size={14} /> Due in 4d
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card padding="lg" className="h-[400px]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Revenue Stream</h3>
            <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5">Monthly Growth Analysis</p>
          </div>
        </div>
        <div className="w-full h-full pb-8">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-card)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              />
              <Area type="monotone" dataKey="amount" stroke="var(--color-primary)" strokeWidth={4} fillOpacity={1} fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-8">
          <h3 className="font-black text-xl mb-6 tracking-tight">Recent Transactions</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-muted)]/30 border border-[var(--color-border)] group hover:border-[var(--color-primary)]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <CreditCard size={18} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--color-text-primary)]">Student Enrollment</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-bold">INV-00{i} · 2h ago</p>
                  </div>
                </div>
                <p className="text-sm font-black text-emerald-600">+ NPR 12,500</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-8">
          <h3 className="font-black text-xl mb-6 tracking-tight">Platform Fees</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-muted)]/30 border border-[var(--color-border)] group hover:border-red-500/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <TrendingDown size={18} className="text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--color-text-primary)]">AWS Infrastructure</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-bold">BILL-00{i} · 1d ago</p>
                  </div>
                </div>
                <p className="text-sm font-black text-red-500">- NPR 45,200</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
