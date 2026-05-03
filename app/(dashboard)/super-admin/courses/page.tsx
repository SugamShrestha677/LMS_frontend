'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { BookOpen, Plus, Search, Filter, MoreHorizontal, Users, Star, Clock } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCourses } from '@/lib/hooks/useCourses';
import { Skeleton } from '@/components/ui/Skeleton';

const mockCourses = [
  { id: 1, name: 'Full-Stack Web Development', tutor: 'Dr. Rabin KC', students: 1240, rating: 4.8, status: 'active' },
  { id: 2, name: 'Advanced UI/UX Design', tutor: 'Sarah Jenkins', students: 850, rating: 4.9, status: 'active' },
  { id: 3, name: 'Data Science & Machine Learning', tutor: 'Michael Chen', students: 2100, rating: 4.7, status: 'draft' },
  { id: 4, name: 'Mobile App Development (Flutter)', tutor: 'Alex Rivera', students: 620, rating: 4.6, status: 'active' },
];

export default function CoursesPage() {
  const { data: coursesData, isLoading } = useCourses();
  const courses = coursesData?.data || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">Platform <span className="text-[var(--color-primary)]">Courses</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Curriculum management and enrollment tracking</p>
        </div>
        <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2">
          <Plus size={16} /> Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Total Courses</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">142</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Total Students</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">12.5K</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Avg. Rating</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">4.82</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Completion Rate</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">76%</p>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden border-none shadow-2xl">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-muted)]/50 border border-[var(--color-border)] rounded-2xl text-sm font-medium focus:border-[var(--color-primary)] outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Course</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Tutor</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Students</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Rating</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-5">
                      <div className="h-10 bg-[var(--color-muted)] rounded-xl w-full" />
                    </td>
                  </tr>
                ))
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-[var(--color-text-secondary)] font-medium">
                    No courses found in the system.
                  </td>
                </tr>
              ) : (
                courses.map((course: any) => (
                  <tr key={course.id} className="hover:bg-[var(--color-muted)]/10 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                          <BookOpen size={18} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[var(--color-text-primary)]">{course.title}</span>
                          <span className="text-[10px] text-[var(--color-text-secondary)] font-medium line-clamp-1">{course.short_description}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-[var(--color-text-secondary)] font-bold">
                      {course.instructor_name || 'Unassigned'}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] font-black">
                        <Users size={14} className="text-[var(--color-text-secondary)]" /> {course.enrolled_count.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-1.5 text-sm text-amber-500 font-black">
                        <Star size={14} fill="currentColor" /> {course.average_rating || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        course.status === 'published' ? "bg-emerald-500/10 text-emerald-600" : 
                        course.status === 'draft' ? "bg-amber-500/10 text-amber-600" :
                        "bg-[var(--color-muted)] text-[var(--color-text-secondary)]"
                      )}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-[var(--color-text-secondary)]">
                      <button className="p-2 hover:bg-[var(--color-muted)] rounded-lg transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
