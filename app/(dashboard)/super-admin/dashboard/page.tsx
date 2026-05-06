'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import {
  Shield, Users, GraduationCap, UserCheck,
  Building2, BookOpen, DollarSign, TrendingUp,
  Activity, ArrowUpRight, BarChart3, Settings,
  Bell, CheckCircle2, AlertTriangle, ShieldAlert,
  FileText, Star
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAdminStats } from '@/lib/hooks/useAdmin';

const quickActions = [
  { label: 'Create Admin', href: '/super-admin/admins/create', icon: Shield, color: 'hover:bg-purple-50 text-purple-600' },
  { label: 'Create Course', href: '/super-admin/courses/create', icon: BookOpen, color: 'hover:bg-blue-50 text-blue-600' },
  { label: 'View Analytics', href: '/super-admin/analytics', icon: BarChart3, color: 'hover:bg-green-50 text-green-600' },
  { label: 'System Settings', href: '/super-admin/settings', icon: Settings, color: 'hover:bg-gray-50 text-gray-600' },
  { label: 'Audit Logs', href: '/super-admin/audit-logs', icon: FileText, color: 'hover:bg-amber-50 text-amber-600' },
  { label: 'Billing', href: '/super-admin/billing', icon: Star, color: 'hover:bg-indigo-50 text-indigo-600' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.45 } },
};

export default function SuperAdminDashboard() {
  const { user } = useAuthStore();
  const { data: statsData, isLoading } = useAdminStats();
  
  const stats = statsData?.data || {
    users: { total: 0, admins: 0, students: 0, tutors: 0, companies: 0 },
    courses: { total: 0 },
    enrollments: { total: 0 }
  };

  const statCards = [
    {
      label: 'Total Admins',
      value: stats.users.admins.toString(),
      icon: Shield,
      color: 'bg-purple-100 text-purple-600',
      href: '/super-admin/admins',
      trend: 'Real-time',
      trendUp: true,
    },
    {
      label: 'Total Students',
      value: stats.users.students.toLocaleString(),
      icon: UserCheck,
      color: 'bg-blue-100 text-blue-600',
      href: '/super-admin/students',
      trend: 'Active system',
      trendUp: true,
    },
    {
      label: 'Partner Companies',
      value: stats.users.companies.toString(),
      icon: Building2,
      color: 'bg-indigo-100 text-indigo-600',
      href: '/super-admin/companies',
      trend: 'Verified',
      trendUp: true,
    },
    {
      label: 'Total Revenue',
      value: 'NPR 0.0', // Finance still dummy until app is added
      icon: DollarSign,
      color: 'bg-green-100 text-green-600',
      href: '/super-admin/finance',
      trend: 'Pending integration',
      trendUp: true,
    },
  ];

  const secondaryStats = [
    { label: 'Tutors', value: stats.users.tutors.toString(), icon: GraduationCap, color: 'bg-orange-100 text-orange-600' },
    { label: 'Active Courses', value: stats.courses.total.toString(), icon: BookOpen, color: 'bg-teal-100 text-teal-600' },
    { label: 'Active Enrollments', value: stats.enrollments.total.toString(), icon: Activity, color: 'bg-cyan-100 text-cyan-600' },
  ];

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="space-y-10 pb-12"
    >
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)] p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-500/20">
            <Shield size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
              Nexus <span className="text-[var(--color-primary)]">Control</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-1 font-medium">
              Welcome back, {user?.first_name || user?.email} · Full platform sovereignty
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 text-purple-600 text-[10px] font-black rounded-xl uppercase tracking-[0.2em] backdrop-blur-sm">
            Root Authority
          </div>
          <div className="px-4 py-2 bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 text-[var(--color-primary)] text-[10px] font-black rounded-xl uppercase tracking-[0.2em] flex items-center gap-2 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_var(--color-primary)]" />
            Core Active
          </div>
        </div>
      </motion.div>

      {/* Primary Stats */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, href, trend, trendUp }) => (
          <Link key={label} href={href}>
            <Card className="p-8 hover:-translate-y-2 transition-all duration-500 cursor-pointer group bg-[var(--color-bg-card)] border-none shadow-xl rounded-[2rem]">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon size={26} />
                </div>
                <div className="w-8 h-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-all">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-1">{label}</p>
              {isLoading ? (
                <div className="h-9 w-24 bg-[var(--color-muted)] animate-pulse rounded-lg" />
              ) : (
                <p className="text-3xl font-black text-[var(--color-text-primary)] tracking-tighter">{value}</p>
              )}
              <div className={cn(
                "mt-4 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tight",
                trendUp ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
              )}>
                {trendUp ? '↑' : '↓'} {trend}
              </div>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* Secondary Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {secondaryStats.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-8 bg-[var(--color-bg-card)] border-none shadow-xl rounded-[2rem]">
            <div className="flex items-center gap-6">
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">{value}</p>
              </div>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6 px-4">
          <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Executive Actions</h2>
          <div className="h-px flex-1 mx-8 bg-gradient-to-r from-[var(--color-border)] to-transparent" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link key={label} href={href}>
              <Card className={cn(
                "p-6 text-center transition-all duration-300 cursor-pointer bg-[var(--color-bg-card)] border-[var(--color-border)] hover:bg-[var(--color-muted)]/20 hover:shadow-2xl hover:-translate-y-1 rounded-[1.5rem]"
              )}>
                <div className={cn("w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center bg-[var(--color-muted)]", color.split(' ')[1])}>
                  <Icon size={24} />
                </div>
                <p className="text-[10px] font-black text-[var(--color-text-primary)] uppercase tracking-widest leading-relaxed">{label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Alerts & Activity */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Alerts */}
        <Card className="p-8 bg-[var(--color-bg-card)] border-none shadow-2xl rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-sm">
                <Bell size={22} />
              </div>
              <div>
                <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Core Alerts</h3>
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-0.5">Urgent Attention Required</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex gap-5 p-6 rounded-[2rem] bg-red-500/[0.03] border border-red-500/10 hover:bg-red-500/[0.05] transition-colors group">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-600 flex-shrink-0 group-hover:scale-110 transition-transform">
                <ShieldAlert size={26} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-red-600 uppercase tracking-tight">Unauthorized Access Detected</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1 font-medium leading-relaxed">Multiple failed authentication attempts across 4 separate nodes from origin <span className="font-bold underline">103.1.2.4</span>.</p>
                <div className="mt-4 flex gap-3">
                  <button className="px-5 py-2 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all">Isolate IP</button>
                  <button className="px-5 py-2 rounded-xl bg-[var(--color-bg-card)] border border-red-200 text-red-700 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all">Audit Trail</button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card className="p-8 bg-[var(--color-bg-card)] border-none shadow-2xl rounded-[2.5rem]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Pending Approval</h3>
                <p className="text-[10px] font-black text-[var(--color-primary)] uppercase tracking-widest mt-0.5">Identity Verification</p>
              </div>
            </div>
            <button className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest hover:underline">Full Queue</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Meta Nepal', type: 'Company' },
              { name: 'Everest Tech', type: 'Company' },
              { name: 'Dr. Rabin KC', type: 'Tutor' },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 rounded-[1.5rem] bg-[var(--color-muted)]/50 border border-[var(--color-border)] hover:border-[var(--color-primary)]/20 transition-all hover:shadow-lg group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary)] transition-colors shadow-sm">
                    {item.type === 'Company' ? <Building2 size={22} /> : <Users size={22} />}
                  </div>
                  <div>
                    <p className="text-sm font-black text-[var(--color-text-primary)]">{item.name}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-widest mt-0.5">{item.type} Account Request</p>
                  </div>
                </div>
                <button className="px-5 py-2 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 shadow-lg shadow-[var(--color-primary)]/20 transition-all">
                  Validate
                </button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
