'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth-store';
import { useUIStore } from '@/lib/store/uiStore';
import { useLogout } from '@/lib/hooks/useAuth';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, Award, Briefcase, BarChart2,
  Users, Building2, Settings, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, FileText, Star, AlertTriangle, ClipboardList,
  UserCheck, TrendingUp, Shield, DollarSign, CreditCard,
  ClipboardCheck, Calendar
} from 'lucide-react';
import { useEffect, useState } from 'react';

// ── Link sets per role ───────────────────────────────────────────────────────
const studentLinks = [
  { href: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/student/courses', label: 'My Courses', icon: BookOpen },
  { href: '/student/progress', label: 'Progress', icon: TrendingUp },
  { href: '/student/badges', label: 'Badges', icon: Award },
  { href: '/student/assessments', label: 'Assessments', icon: ClipboardList },
  { href: '/student/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/student/certificates', label: 'Certificates', icon: FileText },
  { href: '/student/profile', label: 'Profile', icon: UserCheck },
];

const companyLinks = [
  { href: '/company/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/company/talent-pool', label: 'Talent Pool', icon: Users },
  { href: '/company/shortlisted', label: 'Shortlisted', icon: Star },
  { href: '/company/jobs', label: 'Job Postings', icon: Briefcase },
  { href: '/company/interviews', label: 'Interviews', icon: UserCheck },
  { href: '/company/profile', label: 'Company Profile', icon: Building2 },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/companies', label: 'Companies', icon: Building2 },
  { href: '/admin/courses', label: 'Courses', icon: GraduationCap },
  { href: '/admin/events', label: 'Events', icon: Calendar },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

const superAdminLinks = [
  { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/super-admin/users', label: 'User Management', icon: Users },
  { href: '/super-admin/admins', label: 'Admins', icon: Shield },
  { href: '/super-admin/tutors', label: 'Tutors', icon: GraduationCap },
  { href: '/super-admin/companies', label: 'Companies', icon: Building2 },
  { href: '/super-admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/super-admin/finance', label: 'Finance', icon: DollarSign },
  { href: '/super-admin/audit-logs', label: 'Audit Logs', icon: FileText },
  { href: '/super-admin/settings', label: 'Settings', icon: Settings },
];

const tutorLinks = [
  { href: '/tutor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tutor/courses', label: 'My Courses', icon: BookOpen },
  { href: '/tutor/students', label: 'Students', icon: Users },
  { href: '/tutor/assessments', label: 'Assessments', icon: ClipboardCheck },
  { href: '/tutor/certificates', label: 'Certificates', icon: Award },
];

const staffLinks = [
  { href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/staff/tutors', label: 'Tutors', icon: GraduationCap },
  { href: '/staff/students', label: 'Students', icon: UserCheck },
  { href: '/staff/companies', label: 'Companies', icon: Building2 },
  { href: '/staff/courses', label: 'Courses', icon: BookOpen },
];

function getLinks(role?: string) {
  switch (role) {
    case 'student':    return studentLinks;
    case 'company':    return companyLinks;
    case 'admin':      return adminLinks;
    case 'super_admin': return superAdminLinks;
    case 'tutor':      return tutorLinks;
    case 'staff':      return staffLinks;
    default:           return [];
  }
}

/** Display name helper */
function displayName(user: { first_name?: string; last_name?: string; email: string }) {
  if (user.first_name) return `${user.first_name} ${user.last_name ?? ''}`.trim();
  return user.email;
}

function userInitials(user: { first_name?: string; last_name?: string; email: string }) {
  if (user.first_name) return getInitials(`${user.first_name} ${user.last_name ?? ''}`);
  return user.email.slice(0, 2).toUpperCase();
}

// ── Component ────────────────────────────────────────────────────────────────
export function Sidebar() {
  const { user, isLoading, _hasHydrated } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed, mobileDrawerOpen, setMobileDrawerOpen } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActuallyHydrated = _hasHydrated || (typeof window !== 'undefined' && useAuthStore.persist.hasHydrated());

  const links = (mounted && isActuallyHydrated) ? getLinks(user?.role) : [];

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full bg-[#0F0F12]">
      {/* Logo */}
      <div className={cn('flex items-center gap-4 px-7 py-10', sidebarCollapsed && !mobile && 'justify-center px-2')}>
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[var(--color-primary)]/40">
          <GraduationCap size={24} className="text-white" />
        </div>
        {(!sidebarCollapsed || mobile) && (
          <motion.span
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white font-black text-xl tracking-tighter leading-none"
          >
            Leapfrog<br /><span className="text-[var(--color-primary)]">Connect</span>
          </motion.span>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
        {!mounted || !isActuallyHydrated || isLoading ? (
          <div className="space-y-4 px-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 bg-white/5 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link key={href} href={href} onClick={() => mobile && setMobileDrawerOpen(false)}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    'flex items-center gap-4 px-5 py-3.5 rounded-[var(--radius-md)] transition-all duration-200 group relative',
                    sidebarCollapsed && !mobile ? 'justify-center px-2' : '',
                    active ? 'text-white' : 'text-[#5A5A6E] hover:text-white',
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebarActive"
                      className="absolute inset-0 bg-gradient-to-r from-white/[0.08] to-transparent rounded-[var(--radius-md)] border-l-4 border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/5"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 350, damping: 35 }}
                    />
                  )}
                  <Icon
                    size={20}
                    className={cn(
                      'flex-shrink-0 relative z-10 transition-colors duration-200',
                      active ? 'text-[var(--color-primary)]' : 'group-hover:text-white',
                    )}
                  />
                  {(!sidebarCollapsed || mobile) && (
                    <span className={cn(
                      'text-sm font-black tracking-tight truncate relative z-10 uppercase tracking-[0.04em]',
                      active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100',
                    )}>
                      {label}
                    </span>
                  )}
                  {active && !sidebarCollapsed && !mobile && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] relative z-10 shadow-[0_0_12px_var(--color-primary)]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })
        )}
      </nav>

      {/* User footer */}
      <div className={cn('p-6 mt-auto border-t border-white/[0.05]', sidebarCollapsed && !mobile && 'p-2')}>
        {mounted && user && (!sidebarCollapsed || mobile) && (
          <div className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/[0.03] mb-4 border border-white/[0.05] shadow-inner">
            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-lg shadow-[var(--color-primary)]/20">
              {userInitials(user)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-black truncate tracking-tight">{displayName(user)}</p>
              <p className="text-[var(--color-primary)] text-[9px] font-black uppercase tracking-[0.15em] truncate mt-0.5">
                {user.role?.replace('_', ' ')} Account
              </p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout()}
          disabled={isLoggingOut || !mounted}
          className={cn(
            'flex items-center gap-4 px-5 py-3.5 w-full rounded-[var(--radius-md)] text-[#5A5A6E] hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 text-sm font-black uppercase tracking-widest disabled:opacity-50',
            sidebarCollapsed && !mobile && 'justify-center px-2',
          )}
        >
          {isLoggingOut ? (
            <span className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin relative z-10" />
          ) : (
            <LogOut size={18} className="relative z-10 flex-shrink-0" />
          )}
          {(!sidebarCollapsed || mobile) && (
            <span className="relative z-10">{isLoggingOut ? 'Signing out...' : 'Sign Out'}</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 80 : 260 }}
        transition={{ type: 'spring', stiffness: 250, damping: 30 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-[#0F0F12] border-r border-white/5 flex-shrink-0 z-30 overflow-hidden"
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-10 -right-3.5 w-7 h-7 rounded-xl bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/40 flex items-center justify-center hover:scale-110 transition-transform z-10 border-2 border-[#0F0F12]"
        >
          {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </motion.aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 250, damping: 30 }}
              className="fixed left-0 top-0 h-full w-72 bg-[#0F0F12] z-50 lg:hidden shadow-2xl border-r border-white/5"
            >
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
