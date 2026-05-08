'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/lib/services/course.service';
import { useAuthStore } from '@/lib/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ClipboardCheck, Clock, FileText, Play, AlertCircle, 
  CheckCircle2, ChevronRight, Zap, Upload, Monitor,
  BookOpen, Calendar, Timer, Award, Loader2, XCircle, Eye as EyeIcon
} from 'lucide-react';
import { format, isPast, differenceInHours } from 'date-fns';
import api from '@/lib/services/api';

export default function StudentAssessmentsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'all'>('pending');

  // Fetch enrolled courses
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['student-enrolled-courses'],
    queryFn: () => courseService.getStudentEnrolledCourses(),
  });

  const enrollments = Array.isArray(enrollmentsData) 
    ? enrollmentsData 
    : (enrollmentsData as any)?.data || [];

  // Get all course IDs from enrollments
  const courseIds = useMemo(() => {
    return enrollments.map((e: any) => e.course?.id || e.course_id).filter(Boolean);
  }, [enrollments]);

  // Fetch assessments for each enrolled course
  const { data: allAssessmentsData, isLoading: isLoadingAssessments } = useQuery({
    queryKey: ['student-assessments-all', courseIds],
    queryFn: async () => {
      if (courseIds.length === 0) return [];
      
      // Fetch assessments for each course in parallel
      const promises = courseIds.map((courseId: number) =>
        api.get(`/courses/${courseId}/assessments/`)
          .then(res => {
            const assessments = res.data?.data || res.data || [];
            // Find the course info from enrollments
            const enrollment = enrollments.find((e: any) => 
              (e.course?.id || e.course_id) === courseId
            );
            const courseTitle = enrollment?.course?.title || 'Unknown Course';
            
            // Add course info to each assessment
            return assessments.map((a: any) => ({
              ...a,
              course_id: courseId,
              course_title: courseTitle,
              enrollment_id: enrollment?.id,
            }));
          })
          .catch(() => []) // Silently fail for courses without assessments
      );
      
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: courseIds.length > 0,
  });

  const allAssessments = Array.isArray(allAssessmentsData) ? allAssessmentsData : [];

  // Also fetch student's assessment attempts to check completion status
  const { data: studentAttempts } = useQuery({
    queryKey: ['student-assessment-attempts'],
    queryFn: async () => {
      const response = await api.get('/student-assessments/');
      return response.data?.data || response.data || [];
    },
  });

  const attempts = Array.isArray(studentAttempts) ? studentAttempts : [];

  // Separate into pending and completed
  const pendingAssessments = useMemo(() => {
    return allAssessments.filter((a: any) => {
      // Check if student has already submitted
      const hasSubmitted = attempts.some(
        (attempt: any) => 
          attempt.assessment === a.id && 
          (attempt.status === 'submitted' || attempt.status === 'graded')
      );
      
      if (hasSubmitted) return false;
      
      // Check if within time window
      if (a.end_datetime && isPast(new Date(a.end_datetime))) return false;
      
      // Check if before start time
      if (a.start_datetime && new Date() < new Date(a.start_datetime)) {
        if (a.assessment_type !== 'assignment') return false;
      }
      
      return true;
    });
  }, [allAssessments, attempts]);

  const completedAssessments = useMemo(() => {
    return allAssessments.filter((a: any) => {
      return attempts.some(
        (attempt: any) => 
          attempt.assessment === a.id && 
          (attempt.status === 'submitted' || attempt.status === 'graded')
      );
    }).map((a: any) => {
      const attempt = attempts.find((att: any) => att.assessment === a.id);
      return {
        ...a,
        studentAttempt: attempt,
      };
    });
  }, [allAssessments, attempts]);

  const displayedAssessments = activeTab === 'pending' 
    ? pendingAssessments 
    : activeTab === 'completed' 
    ? completedAssessments 
    : allAssessments.map(a => {
        const attempt = attempts.find((att: any) => att.assessment === a.id);
        return { ...a, studentAttempt: attempt };
      });

  const getUrgencyColor = (assessment: any) => {
    if (!assessment.end_datetime) return 'low';
    const hoursLeft = differenceInHours(new Date(assessment.end_datetime), new Date());
    if (hoursLeft < 24) return 'high';
    if (hoursLeft < 72) return 'medium';
    return 'low';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz': return <Monitor size={20} />;
      case 'exam': return <ClipboardCheck size={20} />;
      case 'assignment': return <Upload size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'bg-blue-500/10 text-blue-500';
      case 'exam': return 'bg-purple-500/10 text-purple-500';
      case 'assignment': return 'bg-orange-500/10 text-orange-500';
      default: return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'quiz': return 'Quiz';
      case 'exam': return 'Exam';
      case 'assignment': return 'Assignment';
      default: return type;
    }
  };

  const handleStartAssessment = (assessment: any) => {
    switch (assessment.assessment_type) {
      case 'quiz':
      case 'exam':
        router.push(`/student/assessments/${assessment.id}/take?courseId=${assessment.course_id}`);
        break;
      case 'assignment':
        router.push(`/student/assessments/${assessment.id}/assignment?courseId=${assessment.course_id}`);
        break;
      default:
        router.push(`/student/assessments/${assessment.id}/take?courseId=${assessment.course_id}`);
    }
  };

  const handleViewResult = (assessment: any) => {
    const attempt = assessment.studentAttempt || attempts.find((a: any) => a.assessment === assessment.id);
    if (attempt) {
      if (assessment.assessment_type === 'quiz' || assessment.assessment_type === 'exam') {
        router.push(`/student/assessments/${assessment.id}/take?attempt=${attempt.id}&courseId=${assessment.course_id}`);
      } else {
        router.push(`/student/assessments/${assessment.id}/assignment?attempt=${attempt.id}&courseId=${assessment.course_id}`);
      }
    }
  };

  const isLoading = isLoadingEnrollments || isLoadingAssessments;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="text-[#0A5C4A] animate-spin" />
          <p className="text-[#5A5A6E] font-medium">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm" dot pulse>Live Evaluations</Badge>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Academic Assessments
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Verify your skills and unlock new industry opportunities.
          </p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
          {[
            { key: 'pending', label: 'Pending', count: pendingAssessments.length },
            { key: 'completed', label: 'Completed', count: completedAssessments.length },
            { key: 'all', label: 'All', count: allAssessments.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${
                activeTab === tab.key
                  ? 'bg-white shadow text-[#0A5C4A]'
                  : 'text-[#5A5A6E] hover:text-[#1E1E2A]'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-xs opacity-60">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Course filter chips */}
      {enrollments.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-[#5A5A6E] mr-2">Courses:</span>
          {enrollments.map((enrollment: any) => {
            const course = enrollment.course || {};
            const courseId = course.id || enrollment.course_id;
            const courseTitle = course.title || 'Course';
            return (
              <Badge key={courseId} variant="outline" className="text-xs">
                <BookOpen size={12} className="mr-1" />
                {courseTitle}
              </Badge>
            );
          })}
        </div>
      )}

      {displayedAssessments.length === 0 ? (
        <Card className="p-20 text-center">
          <Award size={64} className="text-[#5A5A6E] mx-auto mb-4 opacity-30" />
          <p className="text-[#5A5A6E] font-medium text-lg">
            {activeTab === 'pending' 
              ? 'No pending assessments. Great job!' 
              : activeTab === 'completed' 
              ? 'No completed assessments yet.' 
              : 'No assessments available for your enrolled courses.'}
          </p>
          {enrollments.length === 0 && (
            <Button onClick={() => router.push('/student/courses')} className="mt-4">
              Browse Courses
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Assessment list */}
          <div className="lg:col-span-2 space-y-6">
            {displayedAssessments.map((assessment: any, idx: number) => {
              const urgency = getUrgencyColor(assessment);
              const isExpired = assessment.end_datetime && isPast(new Date(assessment.end_datetime));
              const notStarted = assessment.start_datetime && new Date(assessment.start_datetime) > new Date();
              const canViewResults = !assessment.end_datetime || isPast(new Date(assessment.end_datetime));
              const isCompleted = assessment.studentAttempt && 
                (assessment.studentAttempt.status === 'submitted' || 
                 assessment.studentAttempt.status === 'graded');
              const score = assessment.studentAttempt?.score;
              const isGraded = assessment.studentAttempt?.status === 'graded';

              return (
                <motion.div
                  key={assessment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                >
                  <Card className={`p-6 md:p-8 border-l-4 ${
                    isCompleted
                      ? 'border-l-green-500 bg-green-500/[0.02]'
                      : urgency === 'high' 
                      ? 'border-l-red-500 bg-red-500/[0.02]' 
                      : urgency === 'medium'
                      ? 'border-l-amber-500 bg-amber-500/[0.02]'
                      : 'border-l-[#0A5C4A] bg-[#0A5C4A]/[0.02]'
                  }`}>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className={`w-10 h-10 rounded-xl ${getTypeColor(assessment.assessment_type)} flex items-center justify-center`}>
                            {getTypeIcon(assessment.assessment_type)}
                          </div>
                          <div>
                            <h3 className="font-black text-xl text-[var(--color-text-primary)]">
                              {assessment.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs capitalize">
                                {getTypeLabel(assessment.assessment_type)}
                              </Badge>
                              {isCompleted && (
                                <Badge variant={isGraded ? 'success' : 'primary'} className="text-xs">
                                  {isGraded ? 'Graded' : 'Submitted'}
                                </Badge>
                              )}
                              {!isCompleted && urgency === 'high' && !isExpired && (
                                <Badge variant="danger" size="sm" pulse>Due Soon</Badge>
                              )}
                              {isExpired && !isCompleted && (
                                <Badge variant="secondary" size="sm">Expired</Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-sm font-medium text-[var(--color-text-secondary)]">
                          <BookOpen size={12} className="inline mr-1" />
                          {assessment.course_title}
                        </p>

                        {assessment.description && (
                          <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                            {assessment.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2">
                          {assessment.duration_minutes > 0 && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                              <Timer size={14} className="text-[var(--color-primary)]" /> 
                              {assessment.duration_minutes} mins
                            </div>
                          )}
                          
                          {assessment.assessment_type !== 'assignment' && assessment.questions?.length > 0 && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                              <FileText size={14} className="text-[var(--color-primary)]" /> 
                              {assessment.questions.length} Questions
                            </div>
                          )}

                          {assessment.end_datetime && (
                            <div className={`flex items-center gap-2 text-xs font-semibold ${
                              urgency === 'high' && !isCompleted ? 'text-red-500' : 'text-[var(--color-text-secondary)]'
                            }`}>
                              <Calendar size={14} /> 
                              Due: {format(new Date(assessment.end_datetime), 'MMM d, yyyy h:mm a')}
                            </div>
                          )}

                          {notStarted && (
                            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
                              <AlertCircle size={14} /> 
                              Starts: {format(new Date(assessment.start_datetime), 'MMM d, yyyy h:mm a')}
                            </div>
                          )}

                          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-text-secondary)]">
                            <Award size={14} className="text-[var(--color-primary)]" /> 
                            Pass: {assessment.passing_score}%
                          </div>
                        </div>

                        {/* Score display for completed */}
                        {isCompleted && score !== null && score !== undefined && (
                          <div className="flex items-center gap-2 pt-2">
                            <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              assessment.studentAttempt?.passed 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              Score: {score}%
                              {assessment.studentAttempt?.passed ? ' ✓ Passed' : ' ✗ Not Passed'}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center">
                        {isCompleted ? (
                          canViewResults ? (
                            <Button 
                              variant="outline"
                              size="lg" 
                              className="gap-2 min-w-[160px]"
                              onClick={() => handleViewResult(assessment)}
                            >
                              <EyeIcon size={18} /> View Results
                            </Button>
                          ) : (
                            <Button 
                              variant="outline"
                              size="lg" 
                              className="gap-2 min-w-[160px]"
                              disabled
                            >
                              <Clock size={18} /> Results Pending
                            </Button>
                          )
                        ) : (
                          <Button 
                            variant={isExpired ? 'outline' : urgency === 'high' ? 'danger' : 'primary'} 
                            size="lg" 
                            className="gap-2 group shadow-lg min-w-[160px]"
                            onClick={() => handleStartAssessment(assessment)}
                            disabled={isExpired || notStarted}
                          >
                            {isExpired ? (
                              <>Not Submitted <XCircle size={18} /></>
                            ) : assessment.assessment_type === 'assignment' ? (
                              <>Submit <Upload size={18} /></>
                            ) : (
                              <>Begin <Play size={18} className="fill-current group-hover:scale-110 transition-transform" /></>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Exam Rules */}
            <Card className="p-8 border-dashed border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
              <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight flex items-center gap-2">
                <AlertCircle size={20} className="text-[var(--color-primary)]" /> Rules & Guidelines
              </h3>
              <ul className="space-y-5">
                {[
                  { title: 'Quizzes', desc: 'Auto-graded. Results shown after deadline or immediately if no deadline.' },
                  { title: 'Exams', desc: 'Includes MCQ & long answer. Manually graded by instructor.' },
                  { title: 'Assignments', desc: 'Upload files or write text. Submit before deadline.' },
                  { title: 'Tab Switching', desc: 'Tracked during quizzes & exams. May auto-submit.' },
                  { title: 'Time Limits', desc: 'Timer starts when you begin. Auto-submits when time runs out.' },
                ].map((rule, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-black mt-0.5">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{rule.title}</p>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{rule.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Quick Stats */}
            <Card className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)]">
                  <Zap size={22} />
                </div>
                <h3 className="font-black text-xl text-[var(--color-text-primary)]">Your Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Pending</span>
                  <span className="font-black text-lg text-amber-500">{pendingAssessments.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Completed</span>
                  <span className="font-black text-lg text-green-500">{completedAssessments.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Enrolled Courses</span>
                  <span className="font-black text-lg text-[#0A5C4A]">{enrollments.length}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <span className="text-sm font-semibold text-[var(--color-text-secondary)]">Average Score</span>
                  <span className="font-black text-lg text-[#0A5C4A]">
                    {completedAssessments.length > 0 
                      ? Math.round(completedAssessments.reduce((acc: number, a: any) => {
                          return acc + (a.studentAttempt?.score || 0);
                        }, 0) / completedAssessments.length)
                      : 0}%
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
