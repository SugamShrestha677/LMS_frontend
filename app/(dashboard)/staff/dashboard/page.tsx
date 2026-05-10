'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import {
  Users, Building2, GraduationCap, BookOpen,
  TrendingUp, ArrowUpRight, BarChart3, Clock,
  CheckCircle2, AlertCircle, Calendar, Shield
} from 'lucide-react';
import Link from 'next/link';
import type { StaffPermission } from '@/lib/types/auth';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.45 } },
};

export default function StaffDashboard() {
  const { user } = useAuthStore();
  const permissions: StaffPermission = user?.permissions ?? {
    can_create_users: false,
    can_manage_courses: false,
    can_manage_students: false,
    can_manage_tutors: false,
    can_manage_companies: false,
    can_manage_payments: false,
    can_manage_settings: false,
    can_view_analytics: false,
    course_scope: 'all',
  };

  const filteredStatCards = [
    {
      label: 'Total Tutors',
      value: '48',
      icon: GraduationCap,
      color: 'bg-orange-100 text-orange-600',
      href: '/staff/tutors',
      trend: '+2 this month',
      trendUp: true,
      show: permissions.can_manage_tutors
    },
    {
      label: 'Total Students',
      value: '1,240',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      href: '/staff/students',
      trend: '+45 this week',
      trendUp: true,
      show: permissions.can_manage_students
    },
    {
      label: 'Partner Companies',
      value: '32',
      icon: Building2,
      color: 'bg-indigo-100 text-indigo-600',
      href: '/staff/companies',
      trend: '3 pending approval',
      trendUp: false,
      show: permissions.can_manage_companies
    },
    {
      label: 'Active Courses',
      value: '142',
      icon: BookOpen,
      color: 'bg-teal-100 text-teal-600',
      href: '/staff/courses',
      trend: '+8 new courses',
      trendUp: true,
      show: permissions.can_manage_courses
    },
    {
      label: 'Pending Payments',
      value: '7',
      icon: CheckCircle2,
      color: 'bg-purple-100 text-purple-600',
      href: '/staff/payments',
      trend: 'Needs verification',
      trendUp: false,
      show: permissions.can_manage_payments
    },
  ].filter(card => card.show);

  const filteredQuickActions = [
    { label: 'Manage Tutors', href: '/staff/tutors', icon: GraduationCap, color: 'hover:bg-orange-50 text-orange-600', show: permissions.can_manage_tutors },
    { label: 'Manage Students', href: '/staff/students', icon: Users, color: 'hover:bg-blue-50 text-blue-600', show: permissions.can_manage_students },
    { label: 'Manage Companies', href: '/staff/companies', icon: Building2, color: 'hover:bg-indigo-50 text-indigo-600', show: permissions.can_manage_companies },
    { label: 'Manage Courses', href: '/staff/courses', icon: BookOpen, color: 'hover:bg-teal-50 text-teal-600', show: permissions.can_manage_courses },
    { label: 'Verify Payments', href: '/staff/payments', icon: CheckCircle2, color: 'hover:bg-purple-50 text-purple-600', show: permissions.can_manage_payments },
  ].filter(action => action.show);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Shield size={22} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              Staff <span className="text-[var(--color-primary)]">Dashboard</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
              Welcome back, {user?.first_name || user?.email} · Operational overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-black rounded-full uppercase tracking-wider">
            Staff Account
          </span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStatCards.map(({ label, value, icon: Icon, color, href, trend, trendUp }) => (
          <Link key={label} href={href}>
            <Card className="p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group border border-[var(--color-border)]">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon size={22} />
                </div>
                <ArrowUpRight size={16} className="text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)] transition-colors" />
              </div>
              <p className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">{label}</p>
              <p className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">{value}</p>
              <p className={`text-xs font-semibold mt-2 ${trendUp ? 'text-green-600' : 'text-amber-600'}`}>{trend}</p>
            </Card>
          </Link>
        ))}
      </motion.div>

      {/* Quick Access */}
      {filteredQuickActions.length > 0 && (
        <motion.div variants={item}>
          <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-4 tracking-tight">Management Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredQuickActions.map(({ label, href, icon: Icon, color }) => (
              <Link key={label} href={href}>
                <Card className={`p-5 text-center ${color} transition-all duration-200 cursor-pointer border border-[var(--color-border)] hover:shadow-md`}>
                  <Icon size={26} className="mx-auto mb-3" />
                  <p className="text-xs font-black text-[var(--color-text-primary)]">{label}</p>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      )}


      {/* Activities & Schedule */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[var(--color-primary)]" />
              <h3 className="font-black text-lg text-[var(--color-text-primary)]">Recent Activities</h3>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { text: 'New company Meta Nepal registered', time: '2h ago', icon: Building2 },
              { text: 'Tutor Dr. Rabin KC updated a course', time: '4h ago', icon: GraduationCap },
              { text: 'New student batch enrollment started', time: '6h ago', icon: Users },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[var(--color-muted)] flex items-center justify-center flex-shrink-0">
                  <activity.icon size={14} className="text-[var(--color-text-secondary)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">{activity.text}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[var(--color-primary)]" />
              <h3 className="font-black text-lg text-[var(--color-text-primary)]">Upcoming Events</h3>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { title: 'Tutor Workshop', date: 'Tomorrow, 10:00 AM' },
              { title: 'Student Orientation', date: 'May 10, 02:00 PM' },
              { title: 'System Maintenance', date: 'May 12, 12:00 AM' },
            ].map((event, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
                <div>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{event.title}</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">{event.date}</p>
                </div>
                <button className="text-[10px] font-black uppercase text-[var(--color-primary)] hover:underline">Details</button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
