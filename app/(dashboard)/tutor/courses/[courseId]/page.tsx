'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCourse } from '@/lib/hooks/useCourses';
import { useLiveSessions } from '@/lib/hooks/useLiveSessions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BookOpen, Edit2, PlayCircle, Users, Clock, 
  BarChart3, FolderOpen, UploadCloud, FileText,
  GraduationCap, ChevronRight, Plus, Radio, Calendar, Wifi, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { data: courseData, isLoading } = useCourse(courseId);
  const { data: sessionsData, isLoading: isLoadingSessions } = useLiveSessions(courseId);
  
  const course = Array.isArray(courseData) ? courseData[0] : courseData;
  const sessions: any[] = Array.isArray(sessionsData) ? sessionsData : (sessionsData as any)?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Course not found</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const quickLinks = [
    { label: 'Modules', href: `/tutor/courses/${courseId}/modules`, icon: FolderOpen, count: course.total_modules || 0 },
    { label: 'Live Classes', href: `/tutor/courses/${courseId}/live-sessions`, icon: Radio, count: sessions.length || 0 },
    { label: 'Resources', href: `/tutor/courses/${courseId}/resources`, icon: FileText, count: 'Files' },
    { label: 'Assessments', href: `/tutor/courses/${courseId}/assessments`, icon: GraduationCap, count: course.total_quizzes || 0 },
    { label: 'Announcements', href: `/tutor/courses/${courseId}/announcements`, icon: BookOpen, count: 'Posts' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Badge variant={course.status === 'published' ? 'primary' : 'secondary'} className="uppercase text-xs">
              {course.status}
            </Badge>
            <Badge variant="outline">{course.level || 'All Levels'}</Badge>
          </div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">{course.title}</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 max-w-2xl">{course.description || course.short_description}</p>
          
          <div className="flex items-center gap-6 mt-4 text-sm text-[var(--color-text-secondary)]">
            <span className="flex items-center gap-1"><Clock size={14} /> {course.duration_weeks || 4} Weeks</span>
            <span className="flex items-center gap-1"><Users size={14} /> {course.enrolled_count || 0} Students</span>
            <span className="flex items-center gap-1"><BookOpen size={14} /> {course.total_modules || 0} Modules</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => router.push(`/tutor/courses/${courseId}/edit`)}>
            <Edit2 size={16} className="mr-2" /> Edit
          </Button>
          <Button onClick={() => router.push(`/tutor/courses/${courseId}/modules/create`)}>
            <Plus size={16} className="mr-2" /> Add Module
          </Button>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="h-full">
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full border-t-2 hover:border-[var(--color-primary)]">
                <link.icon size={28} className="text-[var(--color-primary)] mx-auto mb-3" />
                <p className="font-bold text-[var(--color-text-primary)] text-sm">{link.label}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{link.count}</p>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>
      
      {/* Live Sessions Overview */}
      <div className="space-y-4 pt-4">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="font-black text-2xl text-[var(--color-text-primary)] flex items-center gap-2">
              <Radio size={24} className="text-red-500" />
              Live Classes
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Manage and track your interactive sessions</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push(`/tutor/courses/${courseId}/live-sessions`)}>
            View All <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>

        {isLoadingSessions ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="w-full h-36 bg-gray-100 animate-pulse rounded-2xl" />
             <div className="w-full h-36 bg-gray-100 animate-pulse rounded-2xl hidden md:block" />
             <div className="w-full h-36 bg-gray-100 animate-pulse rounded-2xl hidden lg:block" />
          </div>
        ) : sessions.length === 0 ? (
          <Card className="p-10 text-center border-dashed border-2 bg-gray-50/50">
            <Radio size={48} className="text-[#5A5A6E] opacity-20 mx-auto mb-4" />
            <p className="font-black text-xl text-[var(--color-text-primary)]">No live classes scheduled</p>
            <p className="text-[var(--color-text-secondary)] font-medium mt-2 mb-6">Create your first live session to engage with students.</p>
            <Button onClick={() => router.push(`/tutor/courses/${courseId}/live-sessions`)} size="lg">
              <Plus size={18} className="mr-2" /> Schedule Session
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
             {sessions.slice(0, 3).map((session: any) => (
                <Card key={session.id} className="p-5 flex flex-col justify-between hover:shadow-xl transition-all duration-300 border-l-4 group" style={{
                  borderLeftColor: session.status === 'active' ? '#ef4444' :
                                   session.status === 'completed' ? '#22c55e' : '#3b82f6'
                }}>
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-lg text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{session.title}</h4>
                      <Badge variant={session.status === 'active' ? 'danger' : session.status === 'completed' ? 'success' : 'primary'} size="sm" className="text-[10px] uppercase tracking-widest px-2 py-0.5">
                        {session.status === 'active' ? 'Live Now' : session.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mt-4 text-sm font-semibold text-[var(--color-text-secondary)]">
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-[var(--color-primary)]" />
                        <span>{session.date ? format(parseISO(session.date), 'MMM dd, yyyy') : '—'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-[var(--color-primary)]" />
                        <span>{session.start_time?.slice(0,5)} – {session.end_time?.slice(0,5)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                      Day {session.day_number}
                    </span>
                    {session.meet_link && (
                      <a 
                        href={session.meet_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <Wifi size={12} /> {session.status === 'active' ? 'Join Now' : 'Meeting Link'}
                      </a>
                    )}
                  </div>
                </Card>
             ))}
          </div>
        )}
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Card className="p-8 border-t-4 border-t-gray-200 shadow-sm">
          <h3 className="font-black text-xl mb-6">Course Details</h3>
          <div className="space-y-1">
            <div className="flex justify-between text-sm py-3 border-b border-gray-100">
              <span className="text-[var(--color-text-secondary)] font-semibold">Category</span>
              <span className="font-black">{course.category_name || 'Uncategorized'}</span>
            </div>
            <div className="flex justify-between text-sm py-3 border-b border-gray-100">
              <span className="text-[var(--color-text-secondary)] font-semibold">Duration</span>
              <span className="font-black">{course.duration_weeks || 4} Weeks</span>
            </div>
            <div className="flex justify-between text-sm py-3 border-b border-gray-100">
              <span className="text-[var(--color-text-secondary)] font-semibold">Total Hours</span>
              <span className="font-black">{course.total_hours || 20} Hours</span>
            </div>
            <div className="flex justify-between text-sm py-3 border-b border-gray-100">
              <span className="text-[var(--color-text-secondary)] font-semibold">Max Students</span>
              <span className="font-black">{course.max_students || 50}</span>
            </div>
            <div className="flex justify-between text-sm py-3">
              <span className="text-[var(--color-text-secondary)] font-semibold">Price</span>
              <span className="font-black text-[#0A5C4A] text-base">{course.is_free ? 'Free' : `NPR ${course.price || 0}`}</span>
            </div>
          </div>
        </Card>

        <Card className="p-8 border-t-4 border-t-[#0A5C4A]/20 shadow-sm">
          <h3 className="font-black text-xl mb-6 flex items-center gap-2">
            <CheckCircle2 className="text-[#0A5C4A]" size={22} />
            Learning Outcomes
          </h3>
          {course.learning_outcomes && course.learning_outcomes.length > 0 ? (
            <ul className="space-y-3">
              {course.learning_outcomes.map((outcome: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3 text-sm p-3 bg-gray-50/80 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-5 h-5 bg-[#0A5C4A] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  </div>
                  <span className="text-[var(--color-text-primary)] font-semibold leading-relaxed">{outcome}</span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <BookOpen size={40} className="text-gray-200 mx-auto mb-4" />
              <p className="text-[var(--color-text-secondary)] font-bold">No learning outcomes specified</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}