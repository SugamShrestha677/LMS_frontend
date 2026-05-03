'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Menu, Bell, ChevronDown, GraduationCap, LogOut, User, Settings, Search } from 'lucide-react';
import { useAuthStore } from '@/lib/store/authStore';
import { useUIStore } from '@/lib/store/uiStore';
import { useLogout } from '@/lib/hooks/useAuth';
import { getInitials, getDashboardPath } from '@/lib/utils';
import { ThemeToggle } from '../shared/ThemeToggle';

const publicLinks = [
  { href: '/', label: 'Home' },
  { href: '/#features', label: 'Features' },
  { href: '/#how-it-works', label: 'How It Works' },
];

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const { toggleMobileDrawer } = useUIStore();
  const { mutate: logout } = useLogout();
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/student') || pathname.startsWith('/company') || pathname.startsWith('/admin');

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[var(--color-bg-card)]/70 border-b border-[var(--color-border)] supports-[backdrop-filter]:bg-[var(--color-bg-card)]/60"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Left — Logo + mobile menu */}
        <div className="flex items-center gap-6">
          {isDashboard && isAuthenticated && (
            <button
              onClick={toggleMobileDrawer}
              className="lg:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-colors border border-[var(--color-border)]"
            >
              <Menu size={22} />
            </button>
          )}
          <Link href={isAuthenticated ? getDashboardPath(user?.role ?? '') : '/'} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20 group-hover:scale-110 transition-transform">
              <GraduationCap size={20} className="text-white" />
            </div>
            <span className="font-black text-xl text-[var(--color-text-primary)] tracking-tight hidden sm:block">
              Leapfrog<span className="text-[var(--color-primary)]">Connect</span>
            </span>
          </Link>
        </div>

        {/* Center — Search (Desktop Dashboard) */}
        {isDashboard && (
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="w-full h-11 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-2xl pl-12 pr-4 text-sm font-medium outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/5 transition-all"
            />
          </div>
        )}

        {/* Center — public nav */}
        {!isDashboard && (
          <nav className="hidden md:flex items-center gap-8">
            {publicLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {isAuthenticated && user ? (
            <>
              {/* Notification Bell */}
              <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-colors border border-[var(--color-border)]">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-[var(--color-bg-card)] shadow-sm" />
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center gap-3 pl-1.5 pr-3 py-1.5 rounded-2xl hover:bg-[var(--color-muted)] transition-all border border-transparent hover:border-[var(--color-border)]"
                >
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-primary)] flex items-center justify-center text-white text-[10px] font-black shadow-md">
                    {getInitials(`${user.first_name} ${user.last_name}`)}
                  </div>
                  <span className="hidden sm:block text-sm font-black text-[var(--color-text-primary)] tracking-tight">{user.first_name}</span>
                  <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-[var(--color-text-secondary)]" />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-0 top-full mt-3 w-64 bg-[var(--color-bg-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] border border-[var(--color-border)] py-3 z-20 overflow-hidden"
                      >
                        <div className="px-5 py-3 border-b border-[var(--color-border)] mb-2 bg-[var(--color-muted)]/50">
                          <p className="text-sm font-black text-[var(--color-text-primary)] tracking-tight">{user.first_name} {user.last_name}</p>
                          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5">{user.role?.replace('_', ' ')} Account</p>
                        </div>
                        <div className="px-2">
                          <Link
                            href={`/${user.role === 'student' ? 'student' : user.role === 'company' ? 'company' : 'admin'}/profile`}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)] rounded-xl transition-all"
                          >
                            <User size={18} className="text-[var(--color-primary)]" /> Public Profile
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] hover:text-[var(--color-text-primary)] rounded-xl transition-all"
                          >
                            <Settings size={18} className="text-[var(--color-primary)]" /> Account Settings
                          </Link>
                        </div>
                        <div className="px-2 border-t border-[var(--color-border)] mt-2 pt-2">
                          <button
                            onClick={() => { setProfileOpen(false); logout(); }}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-black text-red-500 hover:bg-red-500/10 w-full rounded-xl transition-all"
                          >
                            <LogOut size={18} /> End Session
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] px-5 py-2.5 transition-all"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-black uppercase tracking-widest text-white bg-[var(--color-primary)] px-6 py-3 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
