'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Menu, Bell, ChevronDown, GraduationCap, LogOut, User, Settings, Search, X } from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useUIStore } from '@/lib/store/uiStore';
import { useLogout } from '@/lib/hooks/useAuth';
import { getInitials, getDashboardPath } from '@/lib/utils';
import { ThemeToggle } from '../shared/ThemeToggle';
import { getDashboardRoute } from '@/lib/utils/role-routes';
import { cn } from '@/lib/utils';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
];

function getProfilePath(role?: string): string {
  switch (role) {
    case 'student': return '/student/profile';
    case 'company': return '/company/profile';
    case 'admin': return '/admin/profile';
    case 'super_admin': return '/super-admin/profile';
    case 'tutor': return '/tutor/profile';
    case 'staff': return '/staff/profile';
    default: return '/profile';
  }
}

function getDisplayName(user: { first_name?: string; last_name?: string; email: string }): string {
  if (user.first_name) return user.first_name;
  return user.email.split('@')[0];
}

function getUserInitials(user: { first_name?: string; last_name?: string; email: string }): string {
  if (user.first_name) return getInitials(`${user.first_name} ${user.last_name ?? ''}`);
  return user.email.slice(0, 2).toUpperCase();
}

export function Navbar() {
  const { user, isAuthenticated, isLoading, _hasHydrated } = useAuthStore();
  const { toggleMobileDrawer } = useUIStore();
  const { mutate: logout } = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll progress bar
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const dashboardPrefixes = ['/student', '/company', '/admin', '/super-admin', '/tutor', '/staff'];
  const isDashboard = dashboardPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isPublicPage = !isDashboard;

  const isActuallyHydrated = _hasHydrated || (typeof window !== 'undefined' && useAuthStore.persist.hasHydrated());
  const showAuthUI = mounted && isActuallyHydrated && isAuthenticated && user && !isLoading;

  // Navbar height shrinks on scroll: 80px → 60px
  const navHeight = scrolled ? 60 : 80;

  return (
    <>
      {/* Fixed Navbar */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: navHeight }}
        className={cn(
          'z-50 transition-all duration-300',
          isDashboard ? 'sticky top-0 w-full' : 'fixed top-0 left-0 right-0 w-full',
          scrolled || isDashboard
            ? 'bg-[var(--color-bg-card)]/90 backdrop-blur-2xl border-b border-[var(--color-border)] shadow-lg shadow-black/5'
            : 'bg-transparent border-b border-transparent'
        )}
      >
        {/* Scroll progress bar — only on public landing page */}
        {isPublicPage && (
          <motion.div
            style={{ scaleX, transformOrigin: '0%' }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0A5C4A] via-[#1E88E5] to-[#7C3AED] dark:from-[#10B981] dark:via-[#3B82F6] dark:to-[#8B5CF6] origin-left"
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-6">

          {/* LEFT — Logo + mobile drawer trigger */}
          <div className="flex items-center gap-4">
            {isDashboard && showAuthUI && (
              <button
                onClick={toggleMobileDrawer}
                className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-colors border border-[var(--color-border)]"
              >
                <Menu size={20} />
              </button>
            )}

            <Link
              href={showAuthUI ? getDashboardRoute(user?.role || '') : '/'}
              className={cn(
                "flex items-center gap-3 group",
                isDashboard ? "lg:hidden" : "" // Hide logo on desktop dashboard because Sidebar already has it
              )}
            >
              <motion.div
                animate={{ scale: scrolled ? 0.85 : 1 }}
                transition={{ duration: 0.3 }}
                className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0A5C4A] to-[#0d7a63] dark:from-[#10B981] dark:to-[#059669] flex items-center justify-center shadow-lg shadow-[#0A5C4A]/20 dark:shadow-[#10B981]/20 group-hover:scale-110 transition-transform flex-shrink-0"
              >
                <GraduationCap size={20} className="text-white" />
              </motion.div>
              <motion.span
                animate={{ opacity: scrolled ? 0.9 : 1 }}
                className="font-black text-xl text-[var(--color-text-primary)] tracking-tight hidden sm:block"
              >
                Leapfrog<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6]">Connect</span>
              </motion.span>
            </Link>
          </div>

          {/* CENTER — Dashboard search */}
          {isDashboard && (
            <div className="hidden md:flex flex-1 max-w-md relative group">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full h-11 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-2xl pl-12 pr-4 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)]"
              />
            </div>
          )}

          {/* CENTER — Public nav links */}
          {isPublicPage && (
            <nav className="hidden md:flex items-center gap-1">
              {publicLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200',
                    scrolled
                      ? 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-muted)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)]/50'
                  )}
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {!mounted || !isActuallyHydrated || isLoading ? (
              <div className="w-10 h-10 rounded-xl bg-[var(--color-muted)] animate-pulse" />
            ) : isAuthenticated && user ? (
              <>
                {/* Bell */}
                <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)] transition-all border border-[var(--color-border)]">
                  <Bell size={18} />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-[var(--color-bg-card)]" />
                </button>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-2xl hover:bg-[var(--color-muted)] transition-all border border-transparent hover:border-[var(--color-border)]"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0A5C4A] to-[#1E88E5] dark:from-[#10B981] dark:to-[#3B82F6] flex items-center justify-center text-white text-[10px] font-black shadow-md">
                      {getUserInitials(user)}
                    </div>
                    <span className="hidden sm:block text-sm font-black text-[var(--color-text-primary)] tracking-tight">
                      {getDisplayName(user)}
                    </span>
                    <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={14} className="text-[var(--color-text-secondary)]" />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {profileOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.96 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute right-0 top-full mt-3 w-64 bg-[var(--color-bg-card)] rounded-2xl shadow-2xl border border-[var(--color-border)] py-2 z-20 overflow-hidden backdrop-blur-xl"
                        >
                          <div className="px-4 py-3 border-b border-[var(--color-border)] mb-1 bg-[var(--color-muted)]/50">
                            <p className="text-sm font-black text-[var(--color-text-primary)] tracking-tight">
                              {user.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : user.email}
                            </p>
                            <p className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5">
                              {user.role?.replace('_', ' ')} Account
                            </p>
                          </div>
                          <div className="px-2">
                            <Link href={getProfilePath(user.role)} onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)] rounded-xl transition-all">
                              <User size={16} className="text-[var(--color-primary)]" /> Public Profile
                            </Link>
                            <Link href="/settings" onClick={() => setProfileOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)] rounded-xl transition-all">
                              <Settings size={16} className="text-[var(--color-primary)]" /> Account Settings
                            </Link>
                          </div>
                          <div className="px-2 border-t border-[var(--color-border)] mt-1 pt-1">
                            <button
                              onClick={() => { setProfileOpen(false); logout(); }}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm font-black text-red-500 hover:bg-red-500/10 w-full rounded-xl transition-all"
                            >
                              <LogOut size={16} /> End Session
                            </button>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="hidden sm:block text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] px-4 py-2.5 rounded-xl hover:bg-[var(--color-muted)] transition-all"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className={cn(
                    'text-xs font-black uppercase tracking-widest text-white px-5 py-2.5 rounded-xl transition-all shadow-lg',
                    scrolled
                      ? 'bg-[var(--color-primary)] shadow-[var(--color-primary)]/20 hover:opacity-90'
                      : 'bg-gradient-to-r from-[#0A5C4A] to-[#0d7a63] dark:from-[#10B981] dark:to-[#059669] hover:scale-105 shadow-[#0A5C4A]/20'
                  )}
                >
                  Get Started
                </Link>

                {/* Mobile menu toggle */}
                <button
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-colors border border-[var(--color-border)]"
                >
                  {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.header>

      {/* Mobile nav drawer — public pages only */}
      <AnimatePresence>
        {mobileMenuOpen && isPublicPage && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-[var(--color-bg-card)] border-l border-[var(--color-border)] flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
                <span className="font-black text-lg text-[var(--color-text-primary)]">
                  Leapfrog<span className="text-[var(--color-primary)]">Connect</span>
                </span>
                <button onClick={() => setMobileMenuOpen(false)} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[var(--color-muted)] transition-colors">
                  <X size={18} className="text-[var(--color-text-secondary)]" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {publicLinks.map(({ href, label }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-muted)] transition-all uppercase tracking-wider"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="p-4 border-t border-[var(--color-border)] space-y-3">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl text-sm font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-all border border-[var(--color-border)]">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-3 rounded-xl text-sm font-black uppercase tracking-widest text-white bg-gradient-to-r from-[#0A5C4A] to-[#0d7a63] dark:from-[#10B981] dark:to-[#059669] shadow-lg transition-all hover:opacity-90">
                  Get Started
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer so content doesn't hide under the fixed nav - only for public pages since dashboard uses sticky */}
      {!isDashboard && <div style={{ height: 80 }} />}
    </>
  );
}
