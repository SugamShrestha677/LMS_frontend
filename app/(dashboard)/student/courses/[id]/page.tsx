'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Badge';
import { PlayCircle } from "lucide-react";
import {
  Play, CheckCircle2, ChevronLeft, ChevronRight,
  FileText, Download, MessageSquare, Star,
  Menu, X, Lock, Clock, ExternalLink, FolderOpen,
  BookOpen, Video, Megaphone, User, Calendar, Award,
  Wifi, WifiOff, Radio, Eye
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
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
import { usePayments } from '@/lib/hooks/useCourses';
import { useLiveSessions } from '@/lib/hooks/useLiveSessions';
import { CoursePaymentModal } from '@/components/student/CoursePaymentModal';
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

export default function CoursePlayer() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'assignments' | 'announcements' | 'live'>('content');
  const courseId = Number(params.id);

  const { data: course, isLoading, refetch: refetchCourse } = useStudentCourse(courseId) as {
    data: CourseData | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  type CourseData = {
    id: number;
    title?: string;
    description?: string;
    short_description?: string;
    price?: number | string;
    is_free?: boolean;
    is_scorm?: boolean;
    course_type?: 'live' | 'self_paced';
    scorm_launch_url?: string;
    scorm_launch_error?: string;
    modules?: Array<{
      id: number;
      title: string;
      description?: string;
      contents?: Array<{
        id: number;
        title: string;
        duration_minutes?: number;
        content_type: string;
        video_url?: string;
        file_url?: string;
        audio_url?: string;
        external_link?: string;
        body_text?: string;
        description?: string;
        scorm_course_id?: string | null;
        scorm_status?: string;
      }>;
    }>;
    assessments?: unknown[];
  };

  type LessonItem = {
    id: number;
    title: string;
    duration: string;
    locked: boolean;
    contentType: string;
    videoUrl?: string | null;
    fileUrl?: string | null;
    audioUrl?: string | null;
    externalLink?: string | null;
    bodyText?: string | null;
    description?: string | null;
    scormCourseId?: string | null;
    scormStatus?: string;
    isLiveSession?: boolean;
    sessionData?: any;
  };

  type CurriculumSection = {
    id: string | number;
    title: string;
    description?: string;
    lessons: LessonItem[];
  };

  type ScormProgress = {
    completion_amount?: number;
  };

  type Enrollment = {
    id?: number;
    course?: {
      id?: number;
    };
    progress_percentage?: number | string;
    completed_contents?: number[];
  };

  const { data: enrolledCourses } = useEnrolledCourses();
  const { mutate: enrollCourse, isPending: enrolling } = useEnrollCourse();
  const { data: resources } = useCourseResources(courseId);
  const { data: announcementsData } = useCourseAnnouncements(courseId);
  const { mutate: completeContent, isPending: completing } = useCompleteContent();
  const { data: liveSessionsData } = useLiveSessions(courseId);
  const liveSessions: any[] = useMemo(
    () => (Array.isArray(liveSessionsData) ? liveSessionsData : (liveSessionsData as any)?.data || []),
    [liveSessionsData]
  );
  const enrolledCourseList: Enrollment[] = Array.isArray(enrolledCourses)
    ? enrolledCourses
    : (enrolledCourses as any)?.data || [];
  const enrollment = enrolledCourseList.find((item: Enrollment) => item.course?.id === courseId);
  const isEnrolled = !!enrollment;
  const {
    data: scormProgress,
    refetch: refetchScormProgress,
    isFetching: fetchingScormProgress,
  } = useScormProgress(courseId, isEnrolled && !!course?.is_scorm) as {
    data: ScormProgress | undefined;
    refetch: () => void;
    isFetching: boolean;
  };

  const syncScormProgress = useCallback(() => {
    refetchCourse();
    window.setTimeout(() => {
      refetchScormProgress();
    }, 1500);
  }, [refetchCourse, refetchScormProgress]);

  useEffect(() => {
    // Handle SCORM exit - refresh data and clean URL
    if (searchParams.get('scorm_exit') === 'true') {
      console.log("SCORM exit detected, refreshing data...");
      
      // Remove the parameter from URL without refreshing the page
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
      
      // Trigger a refresh of the course data and progress
      syncScormProgress();
    }
  }, [searchParams, syncScormProgress]);

  const { data: payments } = usePayments();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [viewingResource, setViewingResource] = useState<{ url: string, title: string } | null>(null);

  const handleDownload = async (url: string, filename: string, resourceId: number) => {
    if (!url) return;
    setDownloadingId(resourceId);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', filename || 'download');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      // Fallback for cross-origin or other issues
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = filename || '';
      link.click();
    } finally {
      setDownloadingId(null);
    }
  };

  const paymentList = useMemo(() => {
    return Array.isArray(payments) ? payments : (payments as any)?.data || [];
  }, [payments]);

  const pendingPayment = useMemo(() => {
    return paymentList.find((p: any) => p.course === courseId && p.status === 'pending');
  }, [paymentList, courseId]);

  const confirmedPayment = useMemo(() => {
    return paymentList.find((p: any) => p.course === courseId && p.status === 'confirmed');
  }, [paymentList, courseId]);

  const hasPendingPayment = !!pendingPayment;
  const isPaid = !!confirmedPayment || course?.is_free;
  const canAccessContent = !!course?.is_free || (isEnrolled && isPaid);

  // Real-time Progress State
  const [liveProgress, setLiveProgress] = useState<{ progress: number; status: string } | null>(null);

  useEffect(() => {
    if (!isEnrolled || !enrollment?.id) return;

    // Construct WebSocket URL - Use 127.0.0.1 for local dev to be more stable
    const host = window.location.hostname === 'localhost' ? '127.0.0.1' : window.location.hostname;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${host}:8000/ws/enrollment/${enrollment.id}/progress/`;
    
    console.log('Connecting to Progress WebSocket:', wsUrl);
    const socket = new WebSocket(wsUrl);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Live Progress Received:', data);
        setLiveProgress({
          progress: data.progress,
          status: data.status
        });
        // We don't need to refetch the whole course here, 
        // as setLiveProgress will update the progress bar.
      } catch (err) {
        console.error('Failed to parse WS message:', err);
      }
    };

    socket.onerror = (err) => {
      console.error('WebSocket Error:', err);
    };

    return () => {
      console.log('Closing Progress WebSocket');
      socket.close();
    };
  }, [enrollment?.id, isEnrolled, refetchCourse]);


  // Announcements
  const announcements = useMemo(() => {
    const list = Array.isArray(announcementsData)
      ? announcementsData
      : (announcementsData as any)?.data || [];
    return list;
  }, [announcementsData]);

  const curriculum: CurriculumSection[] = useMemo(() => {
    if (course?.course_type === 'live') {
      return [{
        id: 'live_sessions',
        title: 'Live Sessions',
        description: 'Scheduled classes',
        lessons: liveSessions.map((session: any) => ({
          id: session.id,
          title: `Day ${session.day_number}: ${session.title}`,
          duration: `${session.start_time?.slice(0, 5)} - ${session.end_time?.slice(0, 5)}`,
          locked: !canAccessContent,
          contentType: 'video',
          isLiveSession: true,
          sessionData: session
        }))
      }];
    }
    if (!course?.modules) return [];
    return course.modules.map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      lessons: (module.contents ?? []).map((content: any) => {
        // Map URLs to the correct property based on content type
        // instead of using a generic fallback chain
        let videoUrl = null;
        let fileUrl = null;
        let audioUrl = null;
        
        switch (content.content_type) {
          case 'video':
          case 'mp4':
            videoUrl = content.video_url || content.file_url || null;
            break;
          case 'pdf':
            fileUrl = content.file_url || content.video_url || null;
            // Also set videoUrl for backward compat with the renderer
            videoUrl = fileUrl;
            break;
          case 'mp3':
            audioUrl = content.audio_url || content.file_url || null;
            videoUrl = audioUrl; // renderer uses videoUrl for audio too
            break;
          default:
            videoUrl = content.video_url || null;
            fileUrl = content.file_url || null;
            audioUrl = content.audio_url || null;
        }
        
        return {
          id: content.id,
          title: content.title,
          duration: `${content.duration_minutes ?? 0} min`,
          locked: !canAccessContent,
          contentType: content.content_type,
          videoUrl,
          fileUrl,
          audioUrl,
          externalLink: content.external_link || null,
          bodyText: content.body_text || null,
          description: content.description || null,
          scormCourseId: content.scorm_course_id,
          scormStatus: content.scorm_status,
        };
      }),
    }));
  }, [course, canAccessContent, liveSessions]);

  const allLessons: LessonItem[] = curriculum.flatMap((section) => section.lessons);
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [scormLessonStatus, setScormLessonStatus] = useState<string | null>(null);
  const [contentLaunchUrl, setContentLaunchUrl] = useState<string | null>(null);
  const [launchingContent, setLaunchingContent] = useState(false);

  useEffect(() => {
    if (allLessons.length > 0) {
      // If we have an active lesson but it's not in the current curriculum (e.g. after a type switch or reload)
      const currentLessonExists = allLessons.some(l => l.id === activeLessonId);

      if (!activeLessonId || !currentLessonExists) {
        // Find the best session to start with: 
        // 1. Ongoing session
        // 2. Next upcoming session
        // 3. First session
        if (course?.course_type === 'live') {
          const ongoing = allLessons.find(l => l.sessionData?.status === 'active');
          if (ongoing) {
            setActiveLessonId(ongoing.id);
            return;
          }

          const upcoming = allLessons.find(l => l.sessionData?.status === 'upcoming');
          if (upcoming) {
            setActiveLessonId(upcoming.id);
            return;
          }
        }

        setActiveLessonId(allLessons[0].id);
      }
    }
  }, [activeLessonId, allLessons, course?.course_type]);

  const activeModule = useMemo(() => {
    if (!activeLessonId) return null;
    return curriculum.find((section: CurriculumSection) =>
      section.lessons.some((lesson: LessonItem) => lesson.id === activeLessonId)
    );
  }, [curriculum, activeLessonId]);

  const activeLesson = allLessons.find((lesson: LessonItem) => lesson.id === activeLessonId);
  const liveSession = activeLesson?.sessionData as any;
  const currentModuleId = typeof activeModule?.id === 'number' ? activeModule.id : null;
  const effectiveScormStatus = scormLessonStatus || activeLesson?.scormStatus || null;

  useEffect(() => {
    setScormLessonStatus(activeLesson?.scormStatus || null);
    setContentLaunchUrl(null);
  }, [activeLesson?.id, activeLesson?.scormStatus]);

  // Sync progress when window gains focus (useful for SCORM windows closing)
  useEffect(() => {
    const handleFocus = () => {
      if (course?.is_scorm || activeLesson?.scormCourseId) {
        console.log('Window focused, syncing SCORM progress...');
        syncScormProgress();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [course?.is_scorm, activeLesson?.scormCourseId, syncScormProgress]);

  // Video Heartbeat Tracking
  const lastHeartbeatRef = useRef<number>(0);
  const handleVideoProgress = async (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const currentTime = Math.floor(video.currentTime);
    const duration = Math.floor(video.duration);
    
    // Heartbeat every 15 seconds
    if (currentTime > 0 && currentTime % 15 === 0 && currentTime !== lastHeartbeatRef.current) {
      lastHeartbeatRef.current = currentTime;
      try {
        const { studentApi } = await import('@/lib/api/student');
        if (enrollment?.id && activeLessonId) {
          // Send progress update to backend
          await studentApi.sendHeartbeat(enrollment.id, {
            content_id: activeLessonId,
            current_time: currentTime,
            duration: duration
          });
          console.log(`Video heartbeat at ${currentTime}s / ${duration}s for lesson ${activeLessonId}`);
        }
      } catch (err) {
        console.error('Heartbeat failed:', err);
      }
    }
  };

  useEffect(() => {
    if (!canAccessContent || !activeLesson?.scormCourseId || effectiveScormStatus !== 'finished') {
      setContentLaunchUrl(null);
      return;
    }

    if (activeLesson?.scormCourseId && effectiveScormStatus === 'finished') {
      const fetchLaunchUrl = async () => {
        setLaunchingContent(true);
        try {
          const { courseService } = await import('@/lib/services/course.service');
          if (currentModuleId == null) {
            return;
          }
          const launchData = await courseService.launchContentScorm(courseId, currentModuleId, activeLesson.id);
          const launchUrl = launchData?.launch_url || launchData?.data?.launch_url;
          if (launchUrl) {
            setContentLaunchUrl(launchUrl);
          } else {
            throw new Error('Launch URL was not returned');
          }
        } catch (error) {
          console.error('Failed to launch content:', error);
        } finally {
          setLaunchingContent(false);
        }
      };
      fetchLaunchUrl();
    } else {
      setContentLaunchUrl(null);
    }
  }, [activeLesson, canAccessContent, courseId, activeModule, effectiveScormStatus, currentModuleId]);

  useEffect(() => {
    // Auto-refresh SCORM status while the lesson is still processing.
    if (!canAccessContent || !activeLesson?.scormCourseId || effectiveScormStatus === 'finished' || currentModuleId == null) {
      return;
    }

    const timer = window.setInterval(async () => {
      try {
        const { courseService } = await import('@/lib/services/course.service');
        const response = await courseService.getContentScormStatus(courseId, currentModuleId, activeLesson.id);
        const liveStatus = String(response?.content_scorm_status || response?.status || '').toLowerCase();
        if (liveStatus) {
          setScormLessonStatus(liveStatus === 'complete' ? 'finished' : liveStatus);
        }
        refetchCourse();
      } catch {
        // Keep polling quietly; transient SCORM API delays are expected.
      }
    }, 6000);

    return () => window.clearInterval(timer);
  }, [activeLesson?.id, activeLesson?.scormCourseId, effectiveScormStatus, courseId, currentModuleId, refetchCourse, canAccessContent]);

  const scormCompletion = typeof scormProgress?.completion_amount === 'number'
    ? scormProgress.completion_amount
    : null;
    
  // Use liveProgress from WebSocket if available, otherwise fallback to REST/SCORM data
  const progress = liveProgress?.progress 
    ?? scormCompletion 
    ?? (enrollment ? Number(enrollment.progress_percentage ?? 0) : 0);
  const scormLaunchUrl = course?.scorm_launch_url as string | undefined;
  const scormLaunchError = course?.scorm_launch_error as string | undefined;

  const resourceList = useMemo(() => {
    const list = Array.isArray(resources) ? resources : (resources as any)?.data || [];
    return list;
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (!activeModule) {
      return resourceList.filter((r: any) => !r.module_id && !r.live_session_id);
    }
    if (course?.course_type === 'live') {
      return resourceList.filter((r: any) =>
        !r.live_session_id || String(r.live_session_id) === String(activeModule.id)
      );
    }
    return resourceList.filter((r: any) =>
      !r.module_id || String(r.module_id) === String(activeModule.id)
    );
  }, [resourceList, activeModule, course?.course_type]);

  const assessments = useMemo(() => {
    const list = Array.isArray(course?.assessments) ? course.assessments : [];
    return list;
  }, [course?.assessments]);

  const filteredAssessments = useMemo(() => {
    if (!activeModule) {
      return assessments.filter((a: any) => !a.module && !a.live_session);
    }
    if (course?.course_type === 'live') {
      return assessments.filter((a: any) =>
        !a.live_session || String(a.live_session) === String(activeModule.id)
      );
    }
    return assessments.filter((a: any) =>
      !a.module || String(a.module) === String(activeModule.id)
    );
  }, [assessments, activeModule, course?.course_type]);

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
                          'text-sm font-bold truncate flex items-center gap-2',
                          lesson.id === activeLessonId ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'
                        )}>
                          {lesson.title}
                          {(lesson as any).isLiveSession && (lesson as any).sessionData?.status === 'active' && (
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-sm shadow-red-500/50" />
                          )}
                        </p>
                        <div className="flex items-center justify-between mt-0.5">
                          <p className="text-[10px] font-medium text-[var(--color-text-secondary)] flex items-center gap-1">
                            <Clock size={10} /> {lesson.duration}
                          </p>
                          {(lesson as any).isLiveSession && (lesson as any).sessionData?.status === 'completed' && (
                            <span className="text-[8px] font-black uppercase tracking-tighter text-green-600 bg-green-50 px-1 rounded">Done</span>
                          )}
                          {(lesson as any).isLiveSession && (lesson as any).sessionData?.status === 'active' && (
                            <span className="text-[8px] font-black uppercase tracking-tighter text-red-600 bg-red-50 px-1 rounded">Ongoing</span>
                          )}
                        </div>
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
              {(activeLesson as any)?.isLiveSession ? (
                <div className="p-8 bg-white border-b border-[var(--color-border)]">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <Badge variant={
                        liveSession.status === 'active' ? 'danger' :
                          liveSession.status === 'completed' ? 'success' : 'secondary'
                      } className="mb-3 uppercase">
                        {liveSession.status === 'active' ? 'Ongoing' : liveSession.status}
                      </Badge>
                      <h2 className="text-2xl font-black text-[var(--color-text-primary)]">{liveSession.title}</h2>
                      <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
                        {format(new Date(liveSession.date), 'MMMM d, yyyy')} • {liveSession.start_time?.slice(0, 5)} - {liveSession.end_time?.slice(0, 5)}
                      </p>
                    </div>
                  </div>

                  {liveSession.status === 'active' && liveSession.meet_link ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Radio size={32} className="text-red-500" />
                      </div>
                      <h3 className="font-bold text-red-900 mb-2">Class is ongoing!</h3>
                      <p className="text-red-700 text-sm mb-6 max-w-md mx-auto">Join the session now to participate in the live discussion.</p>
                      <a
                        href={liveSession.meet_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-10 px-8 rounded-full bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                      >
                        Join Class
                      </a>
                    </div>
                  ) : liveSession.status === 'completed' ? (
                    <div className="bg-green-50 border border-green-100 rounded-2xl p-6">
                      <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" /> Class Completed
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-green-100">
                          <p className="text-xs text-green-700 font-bold mb-1 uppercase tracking-wider">Your Attendance</p>
                          <p className="font-medium text-green-900 capitalize">
                            {liveSession.student_attendance?.status || 'Not Marked'}
                          </p>
                        </div>
                        {liveSession.recording_link && (
                          <div className="bg-white p-4 rounded-xl border border-green-100">
                            <p className="text-xs text-green-700 font-bold mb-1 uppercase tracking-wider">Recording</p>
                            <a href={liveSession.recording_link} target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-medium hover:underline inline-flex items-center gap-1">
                              Watch Recording <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[var(--color-bg-secondary)] rounded-2xl p-6 text-center border border-[var(--color-border)]">
                      <Clock size={32} className="mx-auto text-[var(--color-text-secondary)] mb-3" />
                      <h3 className="font-bold text-[var(--color-text-primary)]">Upcoming Session</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">The join link will appear here when the class starts.</p>
                    </div>
                  )}

                  {liveSession.summary && (
                    <div className="mt-8">
                      <h3 className="font-bold text-lg mb-3">Tutor Notes & Summary</h3>
                      <div className="prose max-w-none text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] whitespace-pre-wrap">
                        {liveSession.summary}
                      </div>
                    </div>
                  )}
                  {liveSession.topics_covered && (
                    <div className="mt-6">
                      <h3 className="font-bold text-lg mb-3">Topics Covered</h3>
                      <div className="prose max-w-none text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] whitespace-pre-wrap">
                        {liveSession.topics_covered}
                      </div>
                    </div>
                  )}
                  {liveSession.homework && (
                    <div className="mt-6">
                      <h3 className="font-bold text-lg mb-3">Homework / Assignments</h3>
                      <div className="prose max-w-none text-sm text-[var(--color-text-secondary)] bg-[var(--color-bg-card)] p-6 rounded-2xl border border-[var(--color-border)] whitespace-pre-wrap">
                        {liveSession.homework}
                      </div>
                    </div>
                  )}
                </div>
              ) : (!activeLesson || allLessons.length === 0) && course.is_scorm ? (
                <div className="aspect-video bg-black relative overflow-hidden flex flex-col items-center justify-center text-white p-8 text-center bg-gradient-to-br from-slate-900 to-black">
                  <div className="w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
                    <PlayCircle className="w-12 h-12 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-3xl font-black mb-4">SCORM Interactive Course</h3>
                  <p className="text-slate-400 mb-10 max-w-md text-lg leading-relaxed">
                    This course will open in a secure dedicated window to ensure your progress is saved perfectly.
                  </p>
                  
                  <div className="flex flex-col gap-4 items-center">
                    {!scormLaunchUrl && !scormLaunchError ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold">Preparing secure session...</p>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        disabled={!scormLaunchUrl}
                        className={cn(
                          "px-12 h-16 rounded-2xl font-black uppercase tracking-widest shadow-2xl transition-all",
                          scormLaunchUrl 
                            ? "shadow-[var(--color-primary)]/40 hover:scale-105 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                            : "bg-slate-800 text-slate-500 cursor-not-allowed"
                        )}
                        onClick={() => {
                          if (scormLaunchUrl) {
                            console.log("Launching SCORM window:", scormLaunchUrl);
                            const width = Math.min(1400, window.screen.availWidth * 0.95);
                            const height = Math.min(900, window.screen.availHeight * 0.95);
                            const left = (window.screen.availWidth - width) / 2;
                            const top = (window.screen.availHeight - height) / 2;
                            
                            window.open(
                              scormLaunchUrl,
                              'SCORMPlayer',
                              `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes,menubar=no`
                            );
                            
                            // Real-time updates are now handled by WebSocket, no more polling!
                            refetchScormProgress();
                          }
                        }}
                      >
                        <Play className="mr-3 fill-current" /> {scormLaunchUrl ? "Start Learning Now" : "Session Initializing..."}
                      </Button>
                    )}
                    
                    <button 
                      onClick={() => {
                        refetchCourse();
                        refetchScormProgress();
                      }}
                      className="text-slate-500 hover:text-white text-sm font-bold transition-colors flex items-center gap-2"
                    >
                      <Award size={16} /> Already finished? Sync Progress
                    </button>
                  </div>
                  
                  {scormLaunchError && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                      <strong>Launch Error:</strong> {scormLaunchError}
                    </div>
                  )}
                </div>
              ) : activeLesson?.scormCourseId ? (
                <div className="aspect-video bg-black relative overflow-hidden flex flex-col items-center justify-center text-white p-8 text-center bg-gradient-to-br from-slate-900 to-black">
                  <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6">
                    <Play className="w-8 h-8 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{activeLesson?.title}</h3>
                  <p className="text-slate-400 mb-8 max-w-xs text-sm">
                    This lesson will open in a separate window to track your progress.
                  </p>
                  
                  {contentLaunchUrl ? (
                    <div className="flex flex-col gap-4 items-center">
                      <Button
                        size="lg"
                        className="px-8 h-12 rounded-xl font-bold transition-all hover:scale-105 shadow-xl shadow-[var(--color-primary)]/20"
                        onClick={async () => {
                          try {
                            if (currentModuleId == null) {
                              return;
                            }

                            setLaunchingContent(true);
                            const { courseService } = await import('@/lib/services/course.service');
                            const launchData = await courseService.launchContentScorm(courseId, currentModuleId, activeLesson.id);
                            const launchUrl = launchData?.launch_url || launchData?.data?.launch_url;

                            if (!launchUrl) {
                              throw new Error('Launch URL was not returned');
                            }

                            setContentLaunchUrl(launchUrl);

                            const width = Math.min(1400, window.screen.availWidth * 0.9);
                            const height = Math.min(900, window.screen.availHeight * 0.9);
                            const left = (window.screen.availWidth - width) / 2;
                            const top = (window.screen.availHeight - height) / 2;

                            window.open(
                              launchUrl,
                              'SCORMContentPlayer',
                              `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
                            );

                            // Real-time updates are now handled by WebSocket, no more polling!
                            refetchScormProgress();
                          } catch (error) {
                            console.error('Failed to launch content:', error);
                          } finally {
                            setLaunchingContent(false);
                          }
                        }}
                      >
                        <Play size={16} className="mr-2 fill-current" /> Launch Lesson
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10"
                        onClick={async () => {
                          try {
                            const { courseService } = await import('@/lib/services/course.service');
                            if (currentModuleId == null) {
                              return;
                            }
                            await courseService.getContentScormStatus(courseId, currentModuleId, activeLesson.id);
                            refetchCourse();
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                      >
                        Refresh Status
                      </Button>
                    </div>
                  ) : launchingContent ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-bold">Initializing session...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 mt-4">
                      <span className="text-sm font-bold text-red-400">Content not ready</span>
                      <Button
                        size="sm"
                        className="px-5"
                        disabled={launchingContent}
                        onClick={async () => {
                          try {
                            setLaunchingContent(true);
                            const { courseService } = await import('@/lib/services/course.service');
                            if (currentModuleId == null) {
                              return;
                            }
                            const wait = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms));
                            for (let attempt = 0; attempt < 3; attempt += 1) {
                              try {
                                await courseService.getContentScormStatus(courseId, currentModuleId, activeLesson.id);
                              } catch {
                                // Keep going; the launch endpoint is the actual gate.
                              }

                              try {
                                const launchData = await courseService.launchContentScorm(courseId, currentModuleId, activeLesson.id);
                                const launchUrl = launchData?.launch_url || launchData?.data?.launch_url;
                                if (launchUrl) {
                                  setContentLaunchUrl(launchUrl);
                                  setScormLessonStatus('finished');
                                  return;
                                }
                              } catch (error: any) {
                                const statusCode = error?.response?.status;
                                if (statusCode === 409 || statusCode === 404) {
                                  await wait(4000);
                                  continue;
                                }
                                throw error;
                              }
                            }
                          } catch (e) {
                            console.error(e);
                          } finally {
                            setLaunchingContent(false);
                          }
                        }}
                      >
                        Try Launch Anyway
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-white border-white/20 hover:bg-white/10"
                        onClick={async () => {
                          try {
                            const { courseService } = await import('@/lib/services/course.service');
                            if (currentModuleId != null) {
                               await courseService.getContentScormStatus(courseId, currentModuleId, activeLesson.id);
                            }
                            refetchCourse();
                          } catch (e) { console.error(e); }
                        }}
                      >
                        Refresh Status
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                activeLesson?.contentType === 'mp3' && activeLesson?.videoUrl ? (
                  <div className="aspect-video bg-[var(--color-bg-card)] relative flex items-center justify-center overflow-hidden border border-[var(--color-border)] rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent" />
                    <div className="relative z-10 w-full max-w-md p-8 text-center">
                      <div className="w-24 h-24 rounded-3xl bg-[var(--color-primary)] mx-auto mb-6 flex items-center justify-center text-white shadow-2xl">
                        <Play size={40} className="fill-current" />
                      </div>
                      <h3 className="font-bold text-[var(--color-text-primary)] mb-4">{activeLesson.title}</h3>
                      <audio
                        key={activeLesson.id}
                        src={activeLesson.videoUrl}
                        controls
                        className="w-full"
                        onEnded={handleLessonCompleted}
                      />
                    </div>
                  </div>
                ) : activeLesson?.contentType === 'pdf' && activeLesson?.videoUrl ? (
                  <div className="w-full h-[600px] bg-gray-100 relative overflow-hidden rounded-xl border border-[var(--color-border)]">
                    <iframe
                      key={activeLesson.id}
                      src={`${activeLesson.videoUrl}#toolbar=0`}
                      className="w-full h-full border-none"
                      title={activeLesson.title}
                      onLoad={() => handleLessonCompleted()}
                    />
                  </div>
                ) : activeLesson?.contentType === 'link' && activeLesson?.externalLink ? (
                  <div className="aspect-video bg-[var(--color-bg-card)] relative flex items-center justify-center overflow-hidden border border-[var(--color-border)] rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/10 to-transparent" />
                    <div className="relative z-10 w-full max-w-md p-8 text-center">
                      <div className="w-24 h-24 rounded-3xl bg-[var(--color-primary)]/10 mx-auto mb-6 flex items-center justify-center text-[var(--color-primary)] shadow-xl">
                        <ExternalLink size={40} />
                      </div>
                      <h3 className="font-bold text-[var(--color-text-primary)] mb-4">{activeLesson.title}</h3>
                      <p className="text-[var(--color-text-secondary)] text-sm mb-8">This is an external resource. Click the button below to open it in a new tab.</p>
                      <Button
                        size="lg"
                        className="w-full"
                        onClick={() => {
                          window.open(activeLesson.externalLink as string, '_blank');
                          handleLessonCompleted();
                        }}
                      >
                        Open Link <ExternalLink size={18} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : activeLesson?.contentType === 'text' ? (
                  <div className="aspect-video bg-[var(--color-bg-card)] relative flex items-center justify-center overflow-hidden border border-[var(--color-border)] rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/5 to-transparent" />
                    <div className="relative z-10 text-center p-8">
                      <FileText size={48} className="mx-auto text-[var(--color-primary)] opacity-50 mb-4" />
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">{activeLesson.title}</h3>
                      <p className="text-[var(--color-text-secondary)] text-sm mb-6">Read the content below</p>
                      <Button onClick={() => handleLessonCompleted()}>Mark as Read</Button>
                    </div>
                  </div>
                ) : activeLesson?.contentType === 'scorm' ? (
                  <div className="aspect-video bg-black relative overflow-hidden flex flex-col items-center justify-center text-white p-8 text-center bg-gradient-to-br from-slate-900 to-black">
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mb-6">
                      <Play className="w-8 h-8 text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{activeLesson?.title}</h3>
                    <p className="text-slate-400 mb-6 max-w-sm text-sm">
                      SCORM content is still processing or not linked yet. Refresh status and try again.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-white border-white/20 hover:bg-white/10"
                      onClick={async () => {
                        try {
                          const { courseService } = await import('@/lib/services/course.service');
                          if (currentModuleId != null) {
                            await courseService.getContentScormStatus(courseId, currentModuleId, activeLesson.id);
                          }
                          refetchCourse();
                        } catch (e) {
                          console.error(e);
                        }
                      }}
                    >
                      Refresh Status
                    </Button>
                  </div>
                ) : activeLesson?.contentType === 'video' && activeLesson?.videoUrl ? (
                  <div className="aspect-video bg-black relative overflow-hidden rounded-xl">
                    <video
                      key={activeLesson.id}
                      src={activeLesson.videoUrl}
                      controls
                      className="w-full h-full"
                      onEnded={handleLessonCompleted}
                      onTimeUpdate={handleVideoProgress}
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl relative flex items-center justify-center group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg-secondary)] to-transparent" />
                    <div className="relative z-10 flex flex-col items-center">
                      <FileText size={48} className="text-[var(--color-text-secondary)] opacity-50 mb-4" />
                      <p className="text-[var(--color-text-secondary)] text-sm">Content format not supported or missing</p>
                    </div>
                  </div>
                )
              )}
            </>
          )}

          {/* Lesson Details (only show for content tab) */}
          {activeTab === 'content' && !(activeLesson as any)?.isLiveSession && (
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
              </div>

              {!canAccessContent && (
                <Card className="mb-8 p-4 bg-white shadow-xl shadow-[var(--color-primary)]/5 border-2 border-[var(--color-border)] rounded-[2rem]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                        course.is_free ? "bg-green-500/10 text-green-500" : "bg-orange-500/10 text-orange-500"
                      )}>
                        {course.is_free ? <CheckCircle2 size={28} /> : <Lock size={28} />}
                      </div>
                      <div>
                        <p className="text-lg font-black text-[var(--color-text-primary)] tracking-tight">
                          {hasPendingPayment ? 'Verification in Progress' : isEnrolled ? 'Payment Required' : 'Start Your Learning Journey'}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)] font-medium">
                          {hasPendingPayment
                            ? 'Our staff is verifying your payment. You will gain access shortly.'
                            : isEnrolled
                              ? `This is a premium course. Please complete payment of NPR ${course.price} to unlock content.`
                              : course.is_free
                                ? 'This course is free. Enroll now to get instant access!'
                                : `This is a premium course. Pay NPR ${course.price} to unlock.`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {!course.is_free && (
                        <div className="text-right mr-2">
                          <p className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Price</p>
                          <p className="text-xl font-black text-[var(--color-text-primary)] tracking-tighter">NPR {course.price}</p>
                        </div>
                      )}

                      {hasPendingPayment ? (
                        <div className="flex items-center gap-2 px-6 py-3 bg-orange-500/10 text-orange-600 rounded-2xl font-black text-xs uppercase tracking-widest border border-orange-500/20">
                          <Clock size={16} className="animate-pulse" />
                          Pending Verification
                        </div>
                      ) : (
                        <Button
                          size="lg"
                          className="px-10 h-14 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[var(--color-primary)]/30 hover:scale-105 transition-transform"
                          loading={enrolling}
                          onClick={() => {
                            if (course.is_free) {
                              enrollCourse(course.id);
                            } else {
                              setShowPaymentModal(true);
                            }
                          }}
                        >
                          {course.is_free ? 'Enroll Free' : isEnrolled ? 'Pay Now' : 'Pay & Enroll'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}

          <CoursePaymentModal
            course={course}
            isOpen={showPaymentModal}
            onClose={() => setShowPaymentModal(false)}
          />


          {canAccessContent && (
            <>
              {/* Tabs */}
              <div className="px-8 max-w-4xl mx-auto">
                <div className="flex border-b border-[var(--color-border)] mb-6">
                  {([
                    { key: 'content', label: 'Content', icon: Play },
                    { key: 'resources', label: 'Resources', icon: FolderOpen, count: filteredResources.length },
                    { key: 'assignments', label: 'Assignments', icon: FileText, count: filteredAssessments.length },
                    { key: 'announcements', label: 'Announcements', icon: Megaphone, count: announcements.length },
                  ] as { key: 'content' | 'resources' | 'assignments' | 'announcements'; label: string; icon: any; count?: number }[]).map((tab) => (
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
              <div className="px-8 pb-8 max-w-4xl mx-auto min-h-[200px] mt-8">
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
                        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50">
                          <p className="text-[var(--color-text-secondary)] text-xs mb-1">Duration</p>
                          <p className="font-bold text-[var(--color-text-primary)]">{activeLesson?.duration || 'N/A'}</p>
                        </div>
                        <div className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/50">
                          <p className="text-[var(--color-text-secondary)] text-xs mb-1">Status</p>
                          <p className="font-bold text-[var(--color-text-primary)] flex items-center gap-1">
                            {activeLessonId && (enrollment?.completed_contents?.includes(activeLessonId) ? (
                              <><CheckCircle2 size={14} className="text-green-500" /> Completed</>
                            ) : (
                              <><Clock size={14} className="text-orange-500" /> In Progress</>
                            ))}
                          </p>
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
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {filteredResources.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--color-bg-secondary)]/50 rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                          <FolderOpen className="mx-auto text-[var(--color-text-secondary)] mb-3" size={32} />
                          <p className="text-[var(--color-text-secondary)]">No resources available for this section.</p>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {filteredResources.map((resource: any) => {
                            const href = resource.file || resource.file_url || resource.external_link;
                            const isExternal = !!resource.external_link && !resource.file && !resource.file_url;
                            return (
                              <div
                                key={resource.id}
                                className="group p-4 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] transition-all flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                                    {isExternal ? <ExternalLink size={20} /> : resource.file_name?.endsWith('.pdf') ? <FileText size={20} /> : <Download size={20} />}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-primary)] transition-colors">
                                      {resource.title}
                                    </h4>
                                    <p className="text-[var(--color-text-secondary)] text-xs">
                                      {resource.file_size ? `${(resource.file_size / 1024 / 1024).toFixed(2)} MB` : isExternal ? 'External Link' : 'File'}
                                    </p>
                                  </div>
                                </div>
                                {href && (
                                  <div className="flex items-center gap-1">
                                    {!isExternal && (
                                      <button
                                        onClick={() => window.open(href, '_blank')}
                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all"
                                        title="Open in new tab"
                                      >
                                        <Eye size={18} />
                                      </button>
                                    )}
                                    {isExternal ? (
                                      <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all"
                                        title="Open in new tab"
                                      >
                                        <ExternalLink size={18} />
                                      </a>
                                    ) : (
                                      <button
                                        onClick={() => handleDownload(href, resource.title || 'download', resource.id)}
                                        disabled={downloadingId === resource.id}
                                        className="p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all disabled:opacity-50"
                                        title="Download"
                                      >
                                        {downloadingId === resource.id ? (
                                          <div className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                          <Download size={18} />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Assignments Tab */}
                  {activeTab === 'assignments' && (
                    <motion.div
                      key="assignments"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4"
                    >
                      {filteredAssessments.length === 0 ? (
                        <div className="text-center py-12 bg-[var(--color-bg-secondary)]/50 rounded-2xl border-2 border-dashed border-[var(--color-border)]">
                          <FileText className="mx-auto text-[var(--color-text-secondary)] mb-3" size={32} />
                          <p className="text-[var(--color-text-secondary)]">No assignments or quizzes available for this section.</p>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {filteredAssessments.map((assessment: any) => {
                            const attempt = (course as any)?.student_attempts?.find((a: any) => a.assessment === assessment.id);
                            const status = attempt?.status || 'not_started';
                            const score = attempt?.score;
                            const isDone = status === 'submitted' || status === 'graded' || status === 'auto_submitted';
                            const deadline = assessment.end_datetime ? new Date(assessment.end_datetime) : null;
                            const isPastDeadline = deadline && new Date() > deadline;

                            return (
                              <div
                                key={assessment.id}
                                className="group p-4 rounded-xl border border-[var(--color-border)] bg-white hover:border-[var(--color-primary)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-start gap-4">
                                  <div className={cn(
                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                                    isDone ? "bg-green-100 text-green-600" : "bg-[var(--color-primary)]/5 text-[var(--color-primary)]"
                                  )}>
                                    {isDone ? <CheckCircle2 size={24} /> : <BookOpen size={24} />}
                                  </div>
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                      <h4 className="font-bold text-[var(--color-text-primary)] text-sm group-hover:text-[var(--color-primary)] transition-colors">
                                        {assessment.title}
                                      </h4>
                                      <Badge className="text-[10px] h-4 capitalize" variant="secondary">
                                        {assessment.assessment_type}
                                      </Badge>
                                      {status !== 'not_started' && !isPastDeadline && (
                                        <Badge
                                          className="text-[10px] h-4 capitalize"
                                          variant={status === 'graded' ? 'success' : 'warning'}
                                        >
                                          {status.replace('_', ' ')}
                                        </Badge>
                                      )}
                                      {isPastDeadline && status === 'not_started' && (
                                        <Badge className="text-[10px] h-4 capitalize" variant="secondary">Expired</Badge>
                                      )}
                                      {isPastDeadline && status !== 'not_started' && (
                                        <Badge className="text-[10px] h-4 capitalize" variant={status === 'graded' ? 'success' : 'secondary'}>
                                          {status === 'auto_submitted' ? 'Auto-submitted' : status === 'graded' ? 'Graded' : 'Expired'}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-[var(--color-text-secondary)] text-xs line-clamp-1 mb-2">
                                      {assessment.description || `Complete this ${assessment.assessment_type} to test your knowledge.`}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-[var(--color-text-secondary)]">
                                      {deadline && (
                                        <span className={cn(
                                          "flex items-center gap-1 font-medium",
                                          isPastDeadline && !isDone ? "text-red-500" : ""
                                        )}>
                                          <Clock size={12} />
                                          Deadline: {format(deadline, 'MMM dd, HH:mm')}
                                        </span>
                                      )}
                                      {score !== null && score !== undefined && (
                                        <span className="flex items-center gap-1 font-bold text-[var(--color-primary)]">
                                          <Award size={12} /> Score: {score}%
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant={isDone ? "outline" : "primary"}
                                  size="sm"
                                  className="rounded-xl h-9 px-6 sm:w-auto w-full font-bold shadow-sm"
                                  onClick={() => {
                                    const courseId = course.id;
                                    if (isDone) {
                                      // View results
                                      if (attempt) {
                                        if (assessment.assessment_type === 'quiz' || assessment.assessment_type === 'exam') {
                                          router.push(`/student/assessments/${assessment.id}/take?attempt=${attempt.id}&courseId=${courseId}`);
                                        } else {
                                          router.push(`/student/assessments/${assessment.id}/assignment?attempt=${attempt.id}&courseId=${courseId}`);
                                        }
                                      }
                                    } else {
                                      // Start/Resume
                                      if (!isPastDeadline) {
                                        if (assessment.assessment_type === 'quiz' || assessment.assessment_type === 'exam') {
                                          router.push(`/student/assessments/${assessment.id}/take?courseId=${courseId}`);
                                        } else {
                                          router.push(`/student/assessments/${assessment.id}/assignment?courseId=${courseId}`);
                                        }
                                      }
                                    }
                                  }}
                                >
                                  {status === 'graded' ? 'View Result' :
                                    status === 'submitted' || status === 'auto_submitted' ? 'View Result' :
                                      isDone ? 'Closed' :
                                      status === 'started' ? 'Resume' : 'Start'}
                                </Button>
                              </div>
                            );
                          })}
                        </div>
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
                            Your instructor hasn&apos;t posted any announcements for this course yet.
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
            </>
          )}
        </div>

        {/* Footer Navigation - Only show on content tab */}
        {canAccessContent && activeTab === 'content' && (
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

      {/* Resource Viewer Modal */}
      <Modal
        open={!!viewingResource}
        onClose={() => setViewingResource(null)}
        title={viewingResource?.title || 'Resource Viewer'}
      >
        <div className="w-full h-[70vh] bg-gray-100 rounded-xl overflow-hidden mt-4 relative">
          {viewingResource?.url && (
            viewingResource.url.toLowerCase().endsWith('.pdf') ? (
              <iframe
                src={`${viewingResource.url}#toolbar=0`}
                className="w-full h-full border-none"
                title="PDF Viewer"
              />
            ) : viewingResource.url.toLowerCase().match(/\.(docx|doc|pptx|ppt|xlsx|xls)$/) ? (
              <iframe
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(viewingResource.url)}&embedded=true`}
                className="w-full h-full border-none"
                title="Document Viewer"
              />
            ) : viewingResource.url.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={viewingResource.url} alt="Resource" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-[var(--color-text-secondary)]">
                <FileText size={48} className="mb-4 opacity-20" />
                <p className="font-bold">Preview not available for this file type</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    handleDownload(viewingResource.url, viewingResource.title, 0);
                    setViewingResource(null);
                  }}
                >
                  Download to View
                </Button>
              </div>
            )
          )}
        </div>
      </Modal>
    </div>
  );
}

