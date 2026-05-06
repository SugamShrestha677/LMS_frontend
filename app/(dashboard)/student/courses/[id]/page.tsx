'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Badge';
import { 
  Play, CheckCircle2, ChevronLeft, ChevronRight, 
  FileText, Download, MessageSquare, Star,
  Menu, X, Lock, Clock, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useEnrollCourse,
  useEnrolledCourses,
  useStudentCourse,
  useCourseResources,
  useCompleteContent,
  useScormProgress,
} from '@/lib/hooks/useStudentData';

export default function CoursePlayer() {
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'discussion'>('content');
  const courseId = Number(params.id);

  const { data: course, isLoading } = useStudentCourse(courseId);
  const { data: enrolledCourses } = useEnrolledCourses();
  const { mutate: enrollCourse, isPending: enrolling } = useEnrollCourse();
  const { data: resources } = useCourseResources(courseId);
  const { mutate: completeContent, isPending: completing } = useCompleteContent();
  const enrollment = enrolledCourses?.find((item) => item.course?.id === courseId);
  const isEnrolled = !!enrollment;
  const {
    data: scormProgress,
    refetch: refetchScormProgress,
    isFetching: fetchingScormProgress,
  } = useScormProgress(courseId, isEnrolled && !!course?.is_scorm);

  const curriculum = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules.map((module: any) => ({
      title: module.title,
      lessons: (module.contents ?? []).map((content: any) => ({
        id: content.id,
        title: content.title,
        duration: `${content.duration_minutes ?? 0} min`,
        locked: !isEnrolled,
        contentType: content.content_type,
        videoUrl: content.video_url || content.file_url || null,
        externalLink: content.external_link || null,
      })),
    }));
  }, [course, isEnrolled]);

  const allLessons = curriculum.flatMap((section) => section.lessons);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);

  useEffect(() => {
    if (!activeLessonId && allLessons.length > 0) {
      setActiveLessonId(allLessons[0].id);
    }
  }, [activeLessonId, allLessons]);

  const activeLesson = allLessons.find((lesson) => lesson.id === activeLessonId);
  const scormCompletion = typeof scormProgress?.completion_amount === 'number'
    ? scormProgress.completion_amount
    : null;
  const progress = scormCompletion ?? (enrollment ? Number(enrollment.progress_percentage ?? 0) : 0);
  const scormLaunchUrl = course?.scorm_launch_url as string | undefined;
  const scormLaunchError = course?.scorm_launch_error as string | undefined;
  const resourceList = useMemo(() => {
    if (Array.isArray(resources)) return resources;
    return (resources as any)?.data || [];
  }, [resources]);

  const handleLessonCompleted = () => {
    if (!isEnrolled || !enrollment?.id || !activeLessonId || course?.is_scorm) {
      return;
    }

    completeContent({
      enrollmentId: enrollment.id,
      contentId: activeLessonId,
      courseId,
    });
  };

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[var(--color-text-secondary)]">
        Loading course...
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)] -m-4 md:-m-6 lg:-m-8 bg-[var(--color-bg)] overflow-hidden">
      
      {/* Sidebar - Curriculum */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="w-80 border-r border-[var(--color-border)] flex flex-col bg-[var(--color-bg-card)] z-20"
          >
            <div className="p-5 border-b border-[var(--color-border)] bg-[var(--color-bg-card)]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[var(--color-text-primary)]">Course Content</h3>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--color-text-secondary)]">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[var(--color-text-secondary)]">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <ProgressBar value={progress} color="var(--color-primary)" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4 pt-4">
              {curriculum.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <h4 className="px-3 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-2">
                    {section.title}
                  </h4>
                  {section.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      disabled={lesson.locked}
                      onClick={() => !lesson.locked && setActiveLessonId(lesson.id)}
                      className={cn(
                        'w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group',
                        lesson.id === activeLessonId
                          ? 'bg-[var(--color-bg-card)] shadow-sm border border-[var(--color-primary)]/20'
                          : 'hover:bg-[var(--color-muted)]',
                        lesson.locked && 'opacity-50 grayscale cursor-not-allowed'
                      )}
                    >
                      <div className={cn(
                        'mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                        lesson.locked
                          ? 'bg-[var(--color-muted)] text-[var(--color-text-secondary)]'
                          : lesson.id === activeLessonId
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-muted)] text-[var(--color-text-secondary)]'
                      )}>
                        {lesson.locked ? <Lock size={10} /> : <Play size={10} className="fill-current" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          'text-sm font-bold truncate',
                          lesson.id === activeLessonId ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'
                        )}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] font-medium text-[var(--color-text-secondary)] flex items-center gap-1">
                          <Clock size={10} /> {lesson.duration}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Player Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--color-bg-card)]">
        {/* Top Header */}
        <div className="h-14 border-b border-[var(--color-border)] flex items-center justify-between px-6 bg-[var(--color-bg-card)] shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-[var(--color-muted)] rounded-lg text-[var(--color-text-secondary)]">
                <Menu size={20} />
              </button>
            )}
            <button onClick={() => router.back()} className="flex items-center gap-1 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" size="sm" dot>Verified Course</Badge>
            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">Rating: 4.9</span>
          </div>
        </div>

        {/* Video & Content */}
        <div className="flex-1 overflow-y-auto">
          {course.is_scorm ? (
            <div className="aspect-video bg-black relative overflow-hidden">
              {scormLaunchUrl ? (
                <iframe
                  src={scormLaunchUrl}
                  title="SCORM Player"
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
                  <span className="text-sm font-bold">SCORM content not ready</span>
                  {scormLaunchError && (
                    <span className="text-xs text-white/70">{scormLaunchError}</span>
                  )}
                </div>
              )}
            </div>
          ) : (
            activeLesson?.videoUrl ? (
              <div className="aspect-video bg-black relative overflow-hidden">
                <video
                  key={activeLesson.id}
                  src={activeLesson.videoUrl}
                  controls
                  className="w-full h-full"
                  onEnded={handleLessonCompleted}
                />
              </div>
            ) : (
              <div className="aspect-video bg-black relative flex items-center justify-center group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90" />
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative z-10 w-20 h-20 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white shadow-2xl"
                >
                  <Play size={32} className="fill-current ml-1" />
                </motion.div>
              </div>
            )
          )}

          {/* Lesson Details */}
          <div className="p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
                  {activeLesson?.title ?? course.title}
                </h2>
                <p className="text-[var(--color-text-secondary)] text-sm">
                  {course.short_description ?? course.description?.slice(0, 120)}
                </p>
              </div>
              {isEnrolled ? (
                course.is_scorm ? (
                  <Button
                    size="lg"
                    className="h-12 px-8 shadow-primary"
                    onClick={() => refetchScormProgress()}
                    loading={fetchingScormProgress}
                  >
                    <CheckCircle2 size={18} className="mr-2" /> Sync Progress
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    className="h-12 px-8 shadow-primary"
                    onClick={() =>
                      activeLessonId &&
                      enrollment?.id &&
                      completeContent({
                        enrollmentId: enrollment.id,
                        contentId: activeLessonId,
                        courseId,
                      })
                    }
                    disabled={!activeLessonId}
                    loading={completing}
                  >
                    <CheckCircle2 size={18} className="mr-2" /> Mark as Completed
                  </Button>
                )
              ) : (
                <Button size="lg" className="h-12 px-8" loading={enrolling} onClick={() => enrollCourse(course.id)}>
                  {course.is_free ? 'Enroll Free' : `Unlock for ${course.price}`}
                </Button>
              )}
            </div>

            {!isEnrolled && (
              <Card className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">This course requires enrollment</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      {course.is_free ? 'Free course. Enroll to access the content.' : 'Paid course. Review the price before enrolling.'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={course.is_free ? 'success' : 'warning'} size="sm">
                      {course.is_free ? 'Free' : 'Paid'}
                    </Badge>
                    <span className="text-sm font-black text-[var(--color-text-primary)]">
                      {course.is_free ? 'NPR 0' : `NPR ${course.price}`}
                    </span>
                    <Button size="sm" loading={enrolling} onClick={() => enrollCourse(course.id)}>
                      {course.is_free ? 'Enroll Now' : 'Pay & Enroll'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)] mb-8">
              {(['content', 'resources', 'discussion'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-6 py-4 text-sm font-bold capitalize transition-all relative',
                    activeTab === tab ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tabActive" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === 'content' && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-[var(--color-text-primary)]">About this lesson</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                      {course.description || 'Course details will appear here.'}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="p-4 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-card)] flex items-center justify-center text-[var(--color-primary)] shadow-sm"><Play size={14} /></div>
                        <div>
                          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase">Type</p>
                          <p className="text-xs font-bold text-[var(--color-text-primary)]">Lesson Content</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-card)] flex items-center justify-center text-[var(--color-primary)] shadow-sm"><FileText size={14} /></div>
                        <div>
                          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase">Resource</p>
                          <p className="text-xs font-bold text-[var(--color-text-primary)]">Course Materials</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'resources' && (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {resourceList.length === 0 ? (
                      <div className="text-sm text-[var(--color-text-secondary)]">No resources available yet.</div>
                    ) : (
                      resourceList.map((res: any) => {
                        const href = res.external_link || res.file_url;
                        const isExternal = !!res.external_link;
                        const label = res.title || res.file_name || res.external_link;

                        return (
                          <div key={res.id} className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                                {isExternal ? <ExternalLink size={18} /> : <Download size={18} />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-[var(--color-text-primary)]">{label}</p>
                                {res.description && (
                                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase line-clamp-1">
                                    {res.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            {href ? (
                              <Button asChild variant="ghost" size="sm" className="text-[var(--color-primary)] font-bold">
                                <a href={href} target="_blank" rel="noreferrer">
                                  {isExternal ? 'Open' : 'Download'}
                                </a>
                              </Button>
                            ) : null}
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                )}

                {activeTab === 'discussion' && (
                  <motion.div
                    key="discussion"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--color-text-secondary)]/50">
                      <MessageSquare size={28} />
                    </div>
                    <h4 className="font-bold text-[var(--color-text-primary)]">No discussions yet</h4>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1 mb-6">Be the first to ask a question about this lesson.</p>
                    <Button variant="outline" size="md">Start Discussion</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="h-16 border-t border-[var(--color-border)] flex items-center justify-between px-8 bg-[var(--color-bg-card)] shrink-0">
          <button className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
            <ChevronLeft size={18} /> Previous Lesson
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity">
            Next Lesson <ChevronRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
