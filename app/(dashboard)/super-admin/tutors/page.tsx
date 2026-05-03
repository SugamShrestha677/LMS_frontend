'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { GraduationCap, Plus, Search, Filter, MoreHorizontal, BookOpen, Star, Mail } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockTutors = [
  { id: 1, name: 'Dr. Rabin KC', expertise: 'Fullstack Development', courses: 8, rating: 4.9, status: 'active' },
  { id: 2, name: 'Sarah Jenkins', expertise: 'UI/UX Design', courses: 5, rating: 4.8, status: 'active' },
  { id: 3, name: 'Michael Chen', expertise: 'Data Science', courses: 12, rating: 4.7, status: 'on_leave' },
  { id: 4, name: 'Alex Rivera', expertise: 'Mobile Apps', courses: 4, rating: 4.9, status: 'active' },
];

export default function TutorsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">Platform <span className="text-[var(--color-primary)]">Tutors</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Academic staff and expertise management</p>
        </div>
        <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2">
          <Plus size={16} /> Register Tutor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Active Tutors</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">48</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Avg. Experience</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">8.5 Yrs</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Student Satisfaction</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">94%</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Courses Taught</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">142</p>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden border-none shadow-2xl">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <input
              type="text"
              placeholder="Search tutors..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-muted)]/50 border border-[var(--color-border)] rounded-2xl text-sm font-medium focus:border-[var(--color-primary)] outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Tutor</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Expertise</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Courses</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {mockTutors.map((tutor) => (
                <tr key={tutor.id} className="hover:bg-[var(--color-muted)]/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 font-black text-xs">
                        {tutor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-black text-[var(--color-text-primary)]">{tutor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-[var(--color-text-secondary)] font-bold">{tutor.expertise}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] font-black">
                      <BookOpen size={14} className="text-[var(--color-text-secondary)]" /> {tutor.courses}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-sm text-amber-500 font-black">
                      <Star size={14} fill="currentColor" /> {tutor.rating}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      tutor.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                    )}>
                      {tutor.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[var(--color-text-secondary)]">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[var(--color-muted)] rounded-lg transition-all">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 hover:bg-[var(--color-muted)] rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
