'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { Card } from '@/components/ui/Card';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, Users, ClipboardCheck,
  Award, TrendingUp, Clock, Star, ArrowUpRight,
  PlayCircle, CheckCircle2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const statCards = [
  {
    label: 'My Courses',
    value: '6',
    icon: BookOpen,
    color: 'bg-blue-100 text-blue-600',
    href: '/tutor/courses',
    trend: '2 active sessions',
    trendUp: true,
  },
  {
    label: 'Total Students',
    value: '184',
    icon: Users,
    color: 'bg-green-100 text-green-600',
    href: '/tutor/students',
    trend: '+12 this week',
    trendUp: true,
  },
  {
    label: 'Assessments',
    value: '24',
    icon: ClipboardCheck,
    color: 'bg-amber-100 text-amber-600',
    href: '/tutor/assessments',
    trend: '8 pending review',
    trendUp: false,
  },
  {
    label: 'Certificates Issued',
    value: '56',
    icon: Award,
    color: 'bg-purple-100 text-purple-600',
    href: '/tutor/certificates',
    trend: '+4 this month',
    trendUp: true,
  },
];

const quickActions = [
  { label: 'My Courses', href: '/tutor/courses', icon: BookOpen, color: 'hover:bg-blue-50 text-blue-600' },
  { label: 'Students', href: '/tutor/students', icon: Users, color: 'hover:bg-green-50 text-green-600' },
  { label: 'Assessments', href: '/tutor/assessments', icon: ClipboardCheck, color: 'hover:bg-amber-50 text-amber-600' },
  { label: 'Certificates', href: '/tutor/certificates', icon: Award, color: 'hover:bg-purple-50 text-purple-600' },
];

const recentCourses = [
  { name: 'Advanced React Development', students: 42, progress: 68, status: 'active' },
  { name: 'Node.js & REST APIs', students: 35, progress: 45, status: 'active' },
  { name: 'TypeScript Fundamentals', students: 28, progress: 100, status: 'completed' },
];

const pendingAssessments = [
  { student: 'Aarav Sharma', course: 'Advanced React', submitted: '2h ago' },
  { student: 'Priya Thapa', course: 'Node.js & REST APIs', submitted: '5h ago' },
  { student: 'Rajesh KC', course: 'Advanced React', submitted: '1d ago' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { ease: [0.25, 1, 0.5, 1], duration: 0.45 } },
};

export default function TutorDashboard() {
  const { user } = useAuthStore();

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center shadow-sm">
            <GraduationCap size={22} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
              Tutor <span className="text-[var(--color-primary)]">Dashboard</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-0.5">
              Welcome back, {user?.first_name || user?.email} · Your teaching overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-orange-100 text-orange-800 text-xs font-black rounded-full uppercase tracking-wider">
            Tutor
          </span>
          <span className="px-3 py-1.5 bg-green-100 text-green-800 text-xs font-black rounded-full uppercase tracking-wider flex items-center gap-1">
            <Star size={10} className="fill-green-600 text-green-600" />
            4.8 Rating
          </span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, href, trend, trendUp }) => (
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

      {/* Quick Actions */}
      <motion.div variants={item}>
        <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-4 tracking-tight">Quick Access</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link key={label} href={href}>
              <Card className={`p-5 text-center ${color} transition-all duration-200 cursor-pointer border border-[var(--color-border)] hover:shadow-md`}>
                <Icon size={26} className="mx-auto mb-3" />
                <p className="text-xs font-black text-[var(--color-text-primary)]">{label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Courses & Assessments */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Courses */}
        <Card className="p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <PlayCircle size={20} className="text-[var(--color-primary)]" />
              <h3 className="font-black text-lg text-[var(--color-text-primary)]">My Courses</h3>
            </div>
            <Link href="/tutor/courses" className="text-xs font-bold text-[var(--color-primary)] hover:underline">View All</Link>
          </div>
          <div className="space-y-4">
            {recentCourses.map((course) => (
              <div key={course.name} className="p-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-[var(--color-text-primary)] truncate flex-1 mr-3">{course.name}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    course.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-[var(--color-border)] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full bg-[var(--color-primary)] transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-secondary)]">{course.progress}%</span>
                  <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                    <Users size={12} />
                    <span className="text-xs font-semibold">{course.students}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Assessments */}
        <Card className="p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-amber-500" />
              <h3 className="font-black text-lg text-[var(--color-text-primary)]">Pending Reviews</h3>
            </div>
            <Link href="/tutor/assessments" className="text-xs font-bold text-[var(--color-primary)] hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {pendingAssessments.map((a) => (
              <div key={a.student} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--color-muted)] transition-all border border-transparent hover:border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-xs font-black">
                    {a.student.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{a.student}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-medium">{a.course} · {a.submitted}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-[var(--color-primary)] text-white text-[10px] font-black uppercase tracking-wider rounded-lg hover:opacity-90 transition-opacity">
                  Review
                </button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
