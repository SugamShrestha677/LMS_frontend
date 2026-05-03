'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';
import { useLogout } from '@/lib/hooks/useAuth';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard, BookOpen, Award, Briefcase, BarChart2,
  Users, Building2, Settings, LogOut, ChevronLeft, ChevronRight,
  GraduationCap, FileText, Star, AlertTriangle, ClipboardList,
  UserCheck, TrendingUp, Shield
} from 'lucide-react';

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
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/admin/alerts', label: 'Alerts', icon: AlertTriangle },
  { href: '/admin/audit-logs', label: 'Audit Logs', icon: Shield },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

function getLinks(role?: string) {
  if (role === 'student') return studentLinks;
  if (role === 'company') return companyLinks;
  if (['admin', 'super_admin', 'staff'].includes(role ?? '')) return adminLinks;
  return [];
}

export function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarCollapsed, setSidebarCollapsed, mobileDrawerOpen, setMobileDrawerOpen } = useUIStore();
  const pathname = usePathname();
  const { mutate: logout } = useLogout();
  const links = getLinks(user?.role);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full bg-[#0F0F12]">
      {/* Logo */}
      <div className={cn('flex items-center gap-4 px-7 py-10', sidebarCollapsed && !mobile && 'justify-center px-2')}>
        <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center flex-shrink-0 shadow-2xl shadow-[var(--color-primary)]/40 group">
          <GraduationCap size={24} className="text-white group-hover:scale-110 transition-transform" />
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
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href} onClick={() => mobile && setMobileDrawerOpen(false)}>
              <motion.div
                whileHover={{ x: 6 }}
                whileTap={{ scale: 0.96 }}
                className={cn(
                  'flex items-center gap-4 px-5 py-4 rounded-[var(--radius-md)] transition-all duration-300 group relative',
                  sidebarCollapsed && !mobile ? 'justify-center px-2' : '',
                  active
                    ? 'text-white'
                    : 'text-[#5A5A6E] hover:text-white',
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
                <Icon size={22} className={cn('flex-shrink-0 relative z-10 transition-colors duration-300', active ? 'text-[var(--color-primary)]' : 'group-hover:text-white')} />
                {(!sidebarCollapsed || mobile) && (
                  <span className={cn('text-sm font-black tracking-tight truncate relative z-10 uppercase tracking-[0.05em]', active ? 'opacity-100' : 'opacity-80 group-hover:opacity-100')}>
                    {label}
                  </span>
                )}
                {active && !sidebarCollapsed && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] relative z-10 shadow-[0_0_12px_var(--color-primary)]"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className={cn('p-6 mt-auto border-t border-white/[0.05]', sidebarCollapsed && !mobile && 'p-2')}>
        {user && (!sidebarCollapsed || mobile) && (
          <div className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-white/[0.03] mb-6 border border-white/[0.05] shadow-inner">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-black flex-shrink-0 shadow-lg shadow-[var(--color-primary)]/20">
              {getInitials(`${user.first_name} ${user.last_name}`)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-black truncate tracking-tight">{user.first_name} {user.last_name}</p>
              <p className="text-[var(--color-primary)] text-[9px] font-black uppercase tracking-[0.15em] truncate mt-0.5">{user.role?.replace('_', ' ')} Account</p>
            </div>
          </div>
        )}
        <button
          onClick={() => logout()}
          className={cn(
            'flex items-center gap-4 px-5 py-4 w-full rounded-[var(--radius-md)] text-[#5A5A6E] hover:bg-red-500/10 hover:text-red-500 transition-all duration-300 text-sm font-black uppercase tracking-widest',
            sidebarCollapsed && !mobile && 'justify-center',
          )}
        >
          <LogOut size={20} className="relative z-10" />
          {(!sidebarCollapsed || mobile) && <span className="relative z-10">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 96 : 280 }}
        transition={{ type: 'spring', stiffness: 250, damping: 30 }}
        className="hidden lg:flex flex-col h-screen sticky top-0 bg-[#0F0F12] border-r border-white/5 flex-shrink-0 z-30 overflow-hidden"
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-10 -right-4 w-8 h-8 rounded-xl bg-[var(--color-primary)] text-white shadow-2xl shadow-[var(--color-primary)]/40 flex items-center justify-center hover:scale-110 transition-transform z-10 border-4 border-[#0F0F12]"
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
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
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 lg:hidden"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 250, damping: 30 }}
              className="fixed left-0 top-0 h-full w-80 bg-[#0F0F12] z-50 lg:hidden shadow-2xl border-r border-white/5"
            >
              <SidebarContent mobile />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
