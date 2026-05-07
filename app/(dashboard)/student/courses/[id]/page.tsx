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
  Menu, X, Lock, Clock, ExternalLink, FolderOpen,
  BookOpen, Video, Megaphone, User, Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useEnrollCourse,
  useEnrolledCourses,
  useStudentCourse,
  useCourseResources,
  useCompleteContent,
  useScormProgress,
  useCourseAnnouncements,
} from '@/lib/hooks/useStudentData';
import { format } from 'date-fns';

export default function CoursePlayer() {
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'announcements'>('content');
  const courseId = Number(params.id);

  const { data: course, isLoading } = useStudentCourse(courseId);
  const { data: enrolledCourses } = useEnrolledCourses();
  const { mutate: enrollCourse, isPending: enrolling } = useEnrollCourse();
  const { data: resources } = useCourseResources(courseId);
  const { data: announcementsData } = useCourseAnnouncements(courseId);
  const { mutate: completeContent, isPending: completing } = useCompleteContent();
  const enrollment = enrolledCourses?.find((item) => item.course?.id === courseId);
  const isEnrolled = !!enrollment;
  const {
    data: scormProgress,
    refetch: refetchScormProgress,
    isFetching: fetchingScormProgress,
  } = useScormProgress(courseId, isEnrolled && !!course?.is_scorm);

  // Announcements
  const announcements = useMemo(() => {
    const list = Array.isArray(announcementsData) 
      ? announcementsData 
      : (announcementsData as any)?.data || [];
    return list;
  }, [announcementsData]);

  const curriculum = useMemo(() => {
    if (!course?.modules) return [];
    return course.modules.map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      lessons: (module.contents ?? []).map((content: any) => ({
        id: content.id,
        title: content.title,
        duration: `${content.duration_minutes ?? 0} min`,
        locked: !isEnrolled,
        contentType: content.content_type,
        videoUrl: content.video_url || content.file_url || null,
        externalLink: content.external_link || null,
        bodyText: content.body_text || null,
        description: content.description || null,
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

  const activeModule = useMemo(() => {
    if (!activeLessonId) return null;
    return curriculum.find(section => 
      section.lessons.some(lesson => lesson.id === activeLessonId)
    );
  }, [curriculum, activeLessonId]);

  const activeLesson = allLessons.find((lesson) => lesson.id === activeLessonId);
  
  const scormCompletion = typeof scormProgress?.completion_amount === 'number'
    ? scormProgress.completion_amount
    : null;
  const progress = scormCompletion ?? (enrollment ? Number(enrollment.progress_percentage ?? 0) : 0);
  const scormLaunchUrl = course?.scorm_launch_url as string | undefined;
  const scormLaunchError = course?.scorm_launch_error as string | undefined;
  
  const resourceList = useMemo(() => {
    const list = Array.isArray(resources) ? resources : (resources as any)?.data || [];
    return list;
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (!activeModule) {
      return resourceList.filter((r: any) => !r.module_id);
    }
    return resourceList.filter((r: any) => 
      !r.module_id || String(r.module_id) === String(activeModule.id)
    );
  }, [resourceList, activeModule]);

  const generalResources = useMemo(() => 
    filteredResources.filter((r: any) => !r.module_id),
    [filteredResources]
  );
  
  const moduleResources = useMemo(() => 
    filteredResources.filter((r: any) => r.module_id),
    [filteredResources]
  );

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

  const goToPreviousLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex > 0) {
      setActiveLessonId(allLessons[currentIndex - 1].id);
    }
  };

  const goToNextLesson = () => {
    const currentIndex = allLessons.findIndex(l => l.id === activeLessonId);
    if (currentIndex < allLessons.length - 1) {
      setActiveLessonId(allLessons[currentIndex + 1].id);
    }
  };

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return <Video size={14} />;
      case 'pdf': return <FileText size={14} />;
      case 'quiz': return <Star size={14} />;
      default: return <Play size={14} />;
    }
  };

  if (isLoading || !course) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-[var(--color-text-secondary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
          <p>Loading course...</p>
        </div>
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
            className="w-80 border-r border-[var(--color-border)] flex flex-col bg-[var(--color-bg-card)] z-20 flex-shrink-0"
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
                  <h4 className="px-3 text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-2 flex items-center gap-2">
                    <BookOpen size={12} />
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
                          ? 'bg-white shadow-sm border border-[var(--color-primary)]/20'
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
                        {lesson.locked ? <Lock size={10} /> : getContentTypeIcon(lesson.contentType)}
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
              <ChevronLeft size={16} /> Back to Courses
            </button>
            {activeModule && (
              <>
                <div className="h-4 w-px bg-[var(--color-border)]" />
                <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
                  {activeModule.title}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" size="sm" dot>Enrolled</Badge>
            <div className="h-4 w-px bg-[var(--color-border)] mx-1" />
            <span className="text-xs font-bold text-[var(--color-text-secondary)]">
              {Math.round(progress)}% Complete
            </span>
          </div>
        </div>

        {/* Video & Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'content' && (
            <>
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
            </>
          )}

          {/* Lesson Details (only show for content tab) */}
          {activeTab === 'content' && (
            <div className="p-8 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-[var(--color-text-primary)] mb-2">
                    {activeLesson?.title ?? course.title}
                  </h2>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    {activeLesson?.description || course.short_description || course.description?.slice(0, 120)}
                  </p>
                  {activeModule && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <FolderOpen size={12} className="mr-1" />
                        {activeModule.title}
                      </Badge>
                    </div>
                  )}
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
                      onClick={handleLessonCompleted}
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
                <Card className="mb-8 p-4">
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
            </div>
          )}

          {/* Tabs */}
          <div className="px-8 max-w-4xl mx-auto">
            <div className="flex border-b border-[var(--color-border)] mb-6">
              {([
                { key: 'content', label: 'Content', icon: Play },
                { key: 'resources', label: 'Resources', icon: FolderOpen, count: filteredResources.length },
                { key: 'announcements', label: 'Announcements', icon: Megaphone, count: announcements.length },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'px-5 py-3 text-sm font-bold capitalize transition-all relative flex items-center gap-2',
                    activeTab === tab.key ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {tab.count}
                    </span>
                  )}
                  {activeTab === tab.key && (
                    <motion.div layoutId="tabActive" className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--color-primary)] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Panels */}
          <div className="px-8 pb-8 max-w-4xl mx-auto min-h-[200px]">
            <AnimatePresence mode="wait">
              {/* Content Tab */}
              {activeTab === 'content' && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  {activeLesson?.bodyText ? (
                    <div className="prose max-w-none">
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap">
                        {activeLesson.bodyText}
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-[var(--color-text-primary)]">About this lesson</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                        {activeLesson?.description || course.description || 'Course details will appear here.'}
                      </p>
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="p-4 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-card)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                        {getContentTypeIcon(activeLesson?.contentType || 'video')}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase">Type</p>
                        <p className="text-xs font-bold text-[var(--color-text-primary)] capitalize">{activeLesson?.contentType || 'Lesson'}</p>
                      </div>
                    </div>
                    <div className="p-4 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-bg-card)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                        <Clock size={14} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase">Duration</p>
                        <p className="text-xs font-bold text-[var(--color-text-primary)]">{activeLesson?.duration || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Resources Tab */}
              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {filteredResources.length === 0 ? (
                    <div className="text-center py-12">
                      <FolderOpen size={48} className="text-[#5A5A6E] mx-auto mb-4 opacity-30" />
                      <p className="text-[var(--color-text-secondary)] font-medium">
                        No resources available for this {activeModule ? 'module' : 'course'} yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      {moduleResources.length > 0 && (
                        <div>
                          <h3 className="text-sm font-black text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                            <FolderOpen size={16} className="text-[var(--color-primary)]" />
                            {activeModule ? `${activeModule.title} Resources` : 'Module Resources'}
                            <Badge variant="outline" className="text-xs">{moduleResources.length}</Badge>
                          </h3>
                          <div className="space-y-3">
                            {moduleResources.map((res: any) => (
                              <ResourceCard key={res.id} resource={res} />
                            ))}
                          </div>
                        </div>
                      )}
                      {generalResources.length > 0 && (
                        <div>
                          <h3 className="text-sm font-black text-[var(--color-text-primary)] mb-3 flex items-center gap-2">
                            <FileText size={16} className="text-[var(--color-primary)]" />
                            General Resources
                            <Badge variant="outline" className="text-xs">{generalResources.length}</Badge>
                          </h3>
                          <div className="space-y-3">
                            {generalResources.map((res: any) => (
                              <ResourceCard key={res.id} resource={res} isGeneral />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {/* Announcements Tab */}
              {activeTab === 'announcements' && (
                <motion.div
                  key="announcements"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {announcements.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Megaphone size={32} className="text-[#5A5A6E] opacity-50" />
                      </div>
                      <h4 className="font-bold text-[var(--color-text-primary)]">No announcements yet</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        Your instructor hasn't posted any announcements for this course yet.
                      </p>
                    </div>
                  ) : (
                    announcements.map((announcement: any, idx: number) => (
                      <motion.div
                        key={announcement.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        <Card className="p-6 border-l-4 border-l-[var(--color-primary)] hover:shadow-md transition-shadow">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                              <Megaphone size={20} className="text-[var(--color-primary)]" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-[var(--color-text-primary)] text-lg">
                                {announcement.title}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 text-xs text-[#5A5A6E]">
                                <span className="flex items-center gap-1">
                                  <User size={12} />
                                  {announcement.created_by_name || 'Instructor'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={12} />
                                  {announcement.created_at 
                                    ? format(new Date(announcement.created_at), 'MMM dd, yyyy - h:mm a')
                                    : 'Recently'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-wrap ml-13">
                            {announcement.content}
                          </p>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Navigation - Only show on content tab */}
        {activeTab === 'content' && (
          <div className="h-16 border-t border-[var(--color-border)] flex items-center justify-between px-8 bg-[var(--color-bg-card)] shrink-0">
            <button 
              onClick={goToPreviousLesson}
              disabled={allLessons.findIndex(l => l.id === activeLessonId) === 0}
              className="flex items-center gap-2 text-sm font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} /> Previous Lesson
            </button>
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              {allLessons.findIndex(l => l.id === activeLessonId) + 1} / {allLessons.length}
            </span>
            <button 
              onClick={goToNextLesson}
              disabled={allLessons.findIndex(l => l.id === activeLessonId) === allLessons.length - 1}
              className="flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next Lesson <ChevronRight size={18} />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Resource Card Component
function ResourceCard({ resource, isGeneral = false }: { resource: any; isGeneral?: boolean }) {
  const href = resource.external_link || resource.file_url || resource.file;
  const isExternal = !!resource.external_link;
  const label = resource.title || resource.file_name || resource.external_link || 'Resource';
  const fileExt = (resource.file_name || resource.file_url || '').split('.').pop()?.toLowerCase();

  const getFileIcon = (ext?: string) => {
    switch (ext) {
      case 'pdf': return <FileText size={18} />;
      case 'mp4':
      case 'webm': return <Video size={18} />;
      case 'mp3':
      case 'wav': return <Star size={18} />;
      default: return <Download size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 rounded-2xl border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors group"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
          isGeneral 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
        }`}>
          {isExternal ? <ExternalLink size={18} /> : getFileIcon(fileExt)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{label}</p>
          {resource.description && (
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
              {resource.description}
            </p>
          )}
          {(resource.file_size && resource.file_size > 0) && (
            <p className="text-[10px] text-[#5A5A6E]">
              {(resource.file_size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
      </div>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="px-4 py-2 rounded-lg text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
        >
          {isExternal ? 'Open' : 'Download'}
        </a>
      ) : null}
    </motion.div>
  );
}