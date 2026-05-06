'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCourse } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  BookOpen, Edit2, PlayCircle, Users, Clock, 
  BarChart3, FolderOpen, UploadCloud, FileText,
  GraduationCap, ChevronRight, Plus
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const { data: courseData, isLoading } = useCourse(courseId);
  
  const course = Array.isArray(courseData) ? courseData[0] : courseData;

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
    { label: 'Resources', href: `/tutor/courses/${courseId}/resources`, icon: FileText, count: 'Files' },
    { label: 'Assessments', href: `/tutor/courses/${courseId}/assessments`, icon: GraduationCap, count: course.total_quizzes || 0 },
    { label: 'Announcements', href: `/tutor/courses/${courseId}/announcements`, icon: BookOpen, count: 'Posts' },
    { label: 'SCORM', href: `/tutor/courses/${courseId}/scorm`, icon: UploadCloud, count: course.is_scorm ? 'Active' : 'Setup' },
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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer h-full">
                <link.icon size={28} className="text-[var(--color-primary)] mx-auto mb-3" />
                <p className="font-bold text-[var(--color-text-primary)] text-sm">{link.label}</p>
                <p className="text-xs text-[var(--color-text-secondary)] mt-1">{link.count}</p>
              </Card>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Course Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Course Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Category</span>
              <span className="font-semibold">{course.category_name || 'Uncategorized'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Duration</span>
              <span className="font-semibold">{course.duration_weeks || 4} Weeks</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Total Hours</span>
              <span className="font-semibold">{course.total_hours || 20} Hours</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Max Students</span>
              <span className="font-semibold">{course.max_students || 50}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[var(--color-text-secondary)]">Price</span>
              <span className="font-semibold">{course.is_free ? 'Free' : `NPR ${course.price || 0}`}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Learning Outcomes</h3>
          {course.learning_outcomes && course.learning_outcomes.length > 0 ? (
            <ul className="space-y-2">
              {course.learning_outcomes.map((outcome: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <ChevronRight size={16} className="text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                  <span className="text-[var(--color-text-secondary)]">{outcome}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">No learning outcomes specified</p>
          )}
        </Card>
      </div>
    </div>
  );
}