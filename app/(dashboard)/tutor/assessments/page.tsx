'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { 
  ClipboardCheck, Search, CheckCircle2, Clock, XCircle, 
  Eye, User, FileText, Upload, Monitor, Edit3,
  BookOpen, Timer, Award, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isPast, isFuture } from 'date-fns';
import api from '@/lib/services/api';
import { useAuthStore } from '@/lib/store/auth-store';

const normalizeList = (value: unknown) => {
  if (Array.isArray(value)) return value;
  const candidate = value as { data?: unknown; results?: unknown } | null;
  if (!candidate || typeof candidate !== 'object') return [];
  return (Array.isArray(candidate.data) && candidate.data)
    || (Array.isArray(candidate.results) && candidate.results)
    || [];
};

export default function TutorAssessmentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'graded'>('all');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');

  // Fetch tutor's courses
  const { data: coursesData } = useQuery({
    queryKey: ['tutor-courses'],
    queryFn: async () => {
      const response = await api.get('/courses/');
      return normalizeList(response.data?.data || response.data);
    },
  });

  const courses = normalizeList(coursesData);

  // Fetch all assessments for tutor (regardless of courses loaded)
  const { data: assessmentsData, isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['tutor-assessments'],
    queryFn: async () => {
      const response = await api.get('/tutor/assessments/');
      return normalizeList(response.data?.data || response.data);
    },
  });

  const allAssessments = normalizeList(assessmentsData);

  // Fetch student submissions
  const { data: submissionsData, isLoading: isLoadingSubmissions } = useQuery({
    queryKey: ['all-student-assessments'],
    queryFn: async () => {
      const response = await api.get('/student-assessments/');
      return normalizeList(response.data?.data || response.data);
    },
  });

  const submissions = normalizeList(submissionsData);

  // Merge assessments with course info and submissions
  const mergedAssessments = useMemo(() => {
    return allAssessments.map((assessment: any) => {
      const courseId = assessment.course || assessment.course_id;
      const course = courses.find((c: any) => c.id === courseId) || {};
      const assessmentSubmissions = submissions.filter(
        (s: any) => s.assessment === assessment.id
      );
      return {
        ...assessment,
        course_title: course.title || 'Unknown Course',
        course_id: courseId,
        submissions: assessmentSubmissions,
        totalSubmissions: assessmentSubmissions.length,
        pendingSubmissions: assessmentSubmissions.filter(
          (s: any) => s.status === 'submitted' && s.score == null
        ).length,
        gradedSubmissions: assessmentSubmissions.filter(
          (s: any) => s.status === 'graded' || (s.status === 'submitted' && s.score != null)
        ).length,
      };
    });
  }, [allAssessments, courses, submissions]);

  // Filter
  const filteredAssessments = useMemo(() => {
    return mergedAssessments.filter((a: any) => {
      const matchesSearch = 
        a.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.course_title?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCourse = selectedCourse === 'all' || String(a.course_id) === selectedCourse;
      
      if (activeTab === 'all') return matchesSearch && matchesCourse;
      if (activeTab === 'pending') return matchesSearch && matchesCourse && a.pendingSubmissions > 0;
      if (activeTab === 'graded') return matchesSearch && matchesCourse && a.gradedSubmissions > 0;
      
      return matchesSearch && matchesCourse;
    });
  }, [mergedAssessments, searchTerm, activeTab, selectedCourse]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <Monitor size={16} />;
      case 'exam': return <ClipboardCheck size={16} />;
      case 'assignment': return <Upload size={16} />;
      default: return <FileText size={16} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-100 text-blue-700';
      case 'exam': return 'bg-purple-100 text-purple-700';
      case 'assignment': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleViewSubmissions = (assessment: any) => {
    router.push(`/tutor/courses/${assessment.course_id}/assessments/${assessment.id}/submissions`);
  };

  if (isLoadingAssessments || isLoadingSubmissions) {
    return (
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-10 h-10 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm" dot pulse>
              {mergedAssessments.length} Assessments
            </Badge>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Student <span className="text-[var(--color-primary)]">Assessments</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Review submissions, grade assignments, and provide feedback.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <FileText size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-[#5A5A6E] font-semibold">Total</p>
            <p className="text-xl font-black">{mergedAssessments.length}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs text-[#5A5A6E] font-semibold">Pending Grade</p>
            <p className="text-xl font-black">
              {submissions.filter((s: any) => s.status === 'submitted' && s.score == null).length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-green-600" />
          </div>
          <div>
            <p className="text-xs text-[#5A5A6E] font-semibold">Graded</p>
            <p className="text-xl font-black">
              {submissions.filter((s: any) => s.status === 'graded' || (s.status === 'submitted' && s.score != null)).length}
            </p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
            <User size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-[#5A5A6E] font-semibold">Students</p>
            <p className="text-xl font-black">{new Set(submissions.map((s: any) => s.student || s.student_id)).size}</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex bg-gray-100 p-1 rounded-2xl w-fit">
          {[
            { key: 'all', label: 'All', count: mergedAssessments.length },
            { key: 'pending', label: 'Pending Review', count: submissions.filter((s: any) => s.status === 'submitted' && s.score == null).length },
            { key: 'graded', label: 'Graded', count: submissions.filter((s: any) => s.status === 'graded' || (s.status === 'submitted' && s.score != null)).length },
          ].map((tab) => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.key 
                  ? 'bg-white shadow-sm text-[#0A5C4A]' 
                  : 'text-[#5A5A6E] hover:text-[#1E1E2A]'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Course filter */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold"
        >
          <option value="all">All Courses</option>
          {courses.map((course: any) => (
            <option key={course.id} value={String(course.id)}>
              {course.title}
            </option>
          ))}
        </select>
        
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A6E]" />
          <input 
            type="text" 
            placeholder="Search assessments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full min-h-[48px] bg-white border border-gray-200 rounded-2xl pl-12 pr-4 outline-none focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] transition-all font-medium"
          />
        </div>
      </div>

      {/* Assessments Grid */}
      {filteredAssessments.length === 0 ? (
        <Card className="p-20 text-center">
          <ClipboardCheck size={64} className="text-[#5A5A6E] mx-auto mb-4 opacity-30" />
          <p className="text-[#5A5A6E] font-medium text-lg">
            {courses.length === 0 ? 'No courses yet. Create a course first.' : 'No assessments found.'}
          </p>
          {courses.length === 0 && (
            <Button onClick={() => router.push('/tutor/courses')} className="mt-4">
              Create Course
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredAssessments.map((assessment: any, idx: number) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${getTypeColor(assessment.assessment_type)} flex items-center justify-center`}>
                        {getTypeIcon(assessment.assessment_type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1E1E2A]">{assessment.title}</h3>
                        <p className="text-xs text-[#5A5A6E] flex items-center gap-1">
                          <BookOpen size={12} /> {assessment.course_title}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {assessment.assessment_type}
                    </Badge>
                  </div>

                  {assessment.description && (
                    <p className="text-sm text-[#5A5A6E] mb-4 line-clamp-2">
                      {assessment.description}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-xs text-[#5A5A6E] mb-4">
                    {assessment.duration_minutes > 0 && (
                      <span className="flex items-center gap-1">
                        <Timer size={12} /> {assessment.duration_minutes} min
                      </span>
                    )}
                    {assessment.questions?.length > 0 && (
                      <span className="flex items-center gap-1">
                        <FileText size={12} /> {assessment.questions.length} Q
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Award size={12} /> Pass: {assessment.passing_score}%
                    </span>
                  </div>

                  {/* Submission stats */}
                  <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
                    <div className="text-center flex-1">
                      <p className="text-xs text-[#5A5A6E]">Total</p>
                      <p className="font-bold text-sm">{assessment.totalSubmissions}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center flex-1">
                      <p className="text-xs text-[#5A5A6E]">Pending</p>
                      <p className="font-bold text-sm text-amber-600">{assessment.pendingSubmissions}</p>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center flex-1">
                      <p className="text-xs text-[#5A5A6E]">Graded</p>
                      <p className="font-bold text-sm text-green-600">{assessment.gradedSubmissions}</p>
                    </div>
                  </div>

                  <Button
                    fullWidth
                    variant={assessment.pendingSubmissions > 0 ? 'primary' : 'outline'}
                    onClick={() => handleViewSubmissions(assessment)}
                  >
                    {assessment.pendingSubmissions > 0 ? (
                      <>Grade Submissions ({assessment.pendingSubmissions})</>
                    ) : (
                      <>View Submissions</>
                    )}
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}