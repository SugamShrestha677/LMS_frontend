'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/lib/services/course.service';
import api from '@/lib/services/api';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Radio, Calendar, Clock, ChevronRight, Play, Wifi } from 'lucide-react';
import { format, parseISO, isPast } from 'date-fns';

export default function StudentLiveClassesWidget() {
  const router = useRouter();

  // Fetch enrolled courses
  const { data: enrollmentsData, isLoading: isLoadingEnrollments } = useQuery({
    queryKey: ['student-enrolled-courses'],
    queryFn: () => courseService.getStudentEnrolledCourses(),
  });

  const enrollments = useMemo(() => {
    return Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData as any)?.data || [];
  }, [enrollmentsData]);

  // Get all course IDs from enrollments
  const courseIds = useMemo(() => {
    return enrollments.map((e: any) => e.course?.id || e.course_id).filter(Boolean);
  }, [enrollments]);

  // Fetch live sessions for each enrolled course
  const { data: allSessionsData, isLoading: isLoadingSessions } = useQuery({
    queryKey: ['student-all-live-sessions', courseIds],
    queryFn: async () => {
      if (courseIds.length === 0) return [];
      
      const promises = courseIds.map((courseId: number) =>
        api.get(`/courses/${courseId}/live-sessions/`)
          .then((res: any) => {
            const sessions = res.data?.data || res.data || [];
            const enrollment = enrollments.find((e: any) => 
              (e.course?.id || e.course_id) === courseId
            );
            const courseTitle = enrollment?.course?.title || 'Course';
            
            return sessions.map((s: any) => ({
              ...s,
              course_id: courseId,
              course_title: courseTitle,
            }));
          })
          .catch(() => [])
      );
      
      const results = await Promise.all(promises);
      return results.flat();
    },
    enabled: courseIds.length > 0,
  });

  const upcomingSessions = useMemo(() => {
    const sessions = allSessionsData || [];
    return sessions
      .filter((s: any) => s.status !== 'completed' && (!s.date || !isPast(parseISO(s.date))))
      .sort((a: any, b: any) => {
        // Sort by status (active first), then by date
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      })
      .slice(0, 3); // Show max 3
  }, [allSessionsData]);

  if (isLoadingEnrollments || isLoadingSessions) {
    return (
      <Card className="p-6 h-[300px] flex items-center justify-center border-dashed">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
          <span className="text-sm font-bold text-[var(--color-text-secondary)]">Loading live classes...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8 border-t-4 border-t-red-500 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-inner">
            <Radio size={20} className="pulse-ring" />
          </div>
          <div>
            <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Live Classes</h3>
            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-0.5">Upcoming & Ongoing</p>
          </div>
        </div>
      </div>

      {upcomingSessions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Radio size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-[var(--color-text-primary)]">No upcoming live classes</p>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">Check back later for new sessions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingSessions.map((session: any) => (
            <div 
              key={session.id} 
              className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${
                session.status === 'active' 
                  ? 'border-red-200 bg-red-50 hover:bg-red-100' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
              onClick={() => router.push(`/student/courses/${session.course_id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <Badge variant={session.status === 'active' ? 'danger' : 'secondary'} size="sm" className="text-[10px] uppercase tracking-widest px-2 py-0.5">
                  {session.status === 'active' ? '🔴 Live Now' : 'Upcoming'}
                </Badge>
                <span className="text-[10px] font-black text-[var(--color-text-secondary)] bg-gray-100 px-2 py-0.5 rounded-md">
                  Day {session.day_number}
                </span>
              </div>
              
              <h4 className="font-black text-[var(--color-text-primary)] text-sm mb-1 line-clamp-1">{session.title}</h4>
              <p className="text-xs font-semibold text-[var(--color-text-secondary)] truncate mb-3">{session.course_title}</p>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-[10px] font-bold text-[var(--color-text-secondary)]">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className={session.status === 'active' ? 'text-red-500' : 'text-blue-500'} /> 
                    {session.date ? format(parseISO(session.date), 'MMM dd') : '—'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} className={session.status === 'active' ? 'text-red-500' : 'text-blue-500'} /> 
                    {session.start_time?.slice(0,5)}
                  </span>
                </div>
                
                {session.status === 'active' && session.meet_link && (
                  <Button size="sm" variant="danger" className="h-7 text-[10px] px-3 gap-1 shadow-md shadow-red-500/20"
                    onClick={(e) => { e.stopPropagation(); window.open(session.meet_link, '_blank'); }}
                  >
                    <Wifi size={12} /> Join
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      <Button 
        variant="outline" 
        fullWidth 
        className="mt-6 gap-2 text-xs"
        onClick={() => router.push('/student/courses')}
      >
        View My Courses <ChevronRight size={14} />
      </Button>
    </Card>
  );
}
