'use client';

import { useStudentCourses, useEnrolledCourses, useEnrollCourse } from '@/lib/hooks/useStudentData';
import { usePayments } from '@/lib/hooks/useCourses';
import { useEvents, useRegisterForEvent, useUnregisterFromEvent } from '@/lib/hooks/useEvents';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Star, Play, Calendar, MapPin, Users, Globe, CheckCircle2, Radio } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils';
import { CoursePaymentModal } from '@/components/student/CoursePaymentModal';
import { format } from 'date-fns';

export default function StudentCourses() {
  const { data: allCourses, isLoading: loadingAll } = useStudentCourses();
  const { data: enrolledCourses, isLoading: loadingEnrolled } = useEnrolledCourses();
  const { mutate: enrollCourse, isPending: enrolling } = useEnrollCourse();
  const { data: eventsData, isLoading: loadingEvents } = useEvents();
  const { mutate: registerForEvent, isPending: registering } = useRegisterForEvent();
  const { mutate: unregisterFromEvent, isPending: unregistering } = useUnregisterFromEvent();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled' | 'events'>('enrolled');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<any>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [registeringEventId, setRegisteringEventId] = useState<number | null>(null);

  const { data: paymentsData } = usePayments();

  const enrolledList = (enrolledCourses ?? []).map((enrollment) => {
    const course = enrollment.course ?? enrollment;
    return {
      ...course,
      progress: Number(enrollment.progress_percentage ?? enrollment.progress ?? 0),
    };
  });

  const enrolledCourseIds = new Set(enrolledList.map((course) => course.id));
  
  const pendingPaymentCourseIds = useMemo(() => {
    const paymentList = Array.isArray(paymentsData) ? paymentsData : (paymentsData as any)?.data || [];
    return new Set(
      paymentList
        .filter((p: any) => p.status === 'pending')
        .map((p: any) => p.course)
    );
  }, [paymentsData]);

  const confirmedPaymentCourseIds = useMemo(() => {
    const paymentList = Array.isArray(paymentsData) ? paymentsData : (paymentsData as any)?.data || [];
    return new Set(
      paymentList
        .filter((p: any) => p.status === 'confirmed')
        .map((p: any) => p.course)
    );
  }, [paymentsData]);

  const eventList = useMemo(() => {
    const list = Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data || [];
    return list.filter((e: any) => e.status === 'scheduled' || e.status === 'ongoing');
  }, [eventsData]);

  const filteredEvents = eventList.filter((e: any) =>
    (e.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const courses = activeTab === 'all' ? allCourses : enrolledList;
  const isLoading = activeTab === 'all' ? loadingAll : loadingEnrolled;

  const filteredCourses = courses?.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  const formatPrice = (course: any) => {
    if (course.is_free) return 'Free';
    const amount = typeof course.price === 'number' ? course.price : Number(course.price || 0);
    return `NPR ${formatNumber(amount)}`;
  };

  const getThumbnailUrl = (course: any) => {
    const thumbnail = course?.thumbnail_url ?? course?.thumbnail;
    if (!thumbnail) return null;
    if (typeof thumbnail === 'string') return thumbnail;
    if (typeof thumbnail.url === 'string') return thumbnail.url;
    if (typeof thumbnail.secure_url === 'string') return thumbnail.secure_url;
    if (typeof thumbnail.path === 'string') return thumbnail.path;
    return null;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Learning <span className="text-gradient">Hub</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Master new skills, join events, and earn verified badges.</p>
        </div>

        <div className="flex bg-[var(--color-bg-card)] p-1.5 rounded-2xl border border-[var(--color-border)] shadow-sm">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'enrolled' 
                ? 'bg-[var(--color-primary)] text-white shadow-md' 
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)]'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'all' 
                ? 'bg-[var(--color-primary)] text-white shadow-md' 
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)]'
            }`}
          >
            Browse All
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'events' 
                ? 'bg-[var(--color-primary)] text-white shadow-md' 
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)]'
            }`}
          >
            <Calendar size={14} /> Events
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <Input
            id="course-search"
            placeholder="Search for courses, instructors, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
            className="h-[46px]"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto h-[46px] bg-[var(--color-bg-card)]">
          <Filter size={18} className="mr-2" /> Filters
        </Button>
      </div>

      {/* Course Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-0 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </Card>
            ))}
          </motion.div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-[var(--color-bg-card)] rounded-3xl border border-dashed border-[var(--color-border)]"
          >
            <div className="w-20 h-20 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-[var(--color-text-secondary)]/40" />
            </div>
            <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No courses found</h3>
            <p className="text-[var(--color-text-secondary)] mt-2">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card hover className="p-0 overflow-hidden group">
                  {/* Thumbnail */}
                  <div className="h-48 bg-[var(--color-muted)] relative overflow-hidden">
                    <img 
                      src={getThumbnailUrl(course) || `https://api.dicebear.com/7.x/shapes/svg?seed=${course.id}`}
                      alt={course.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500${getThumbnailUrl(course) ? '' : ' opacity-60'}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="primary" size="sm" className="bg-[var(--color-primary)]/90 text-white border-none shadow-lg">
                        {course.category_name ?? 'Tech'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-[var(--color-bg-card)] bg-[var(--color-muted)] overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.id + i}`} alt="user" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider">
                        +1.2k Students
                      </span>
                    </div>

                    <h3 className="font-bold text-[var(--color-text-primary)] text-lg mb-2 line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[var(--color-text-secondary)] mb-4 flex items-center gap-1.5 font-medium">
                      <Clock size={12} /> {course.total_hours ?? 0} Hours • {course.duration_weeks ?? 0} Weeks
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant={course.is_free ? 'success' : 'warning'} size="sm">
                        {course.is_free ? 'Free' : 'Paid'}
                      </Badge>
                      <span className="text-xs font-bold text-[var(--color-text-primary)]">
                        {formatPrice(course)}
                      </span>
                    </div>

                    {activeTab === 'enrolled' ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[var(--color-primary)]">Progress</span>
                          <span className="font-black">{course.progress ?? 45}%</span>
                        </div>
                        <ProgressBar value={course.progress ?? 45} color="var(--color-primary)" />
                        <Button fullWidth size="md" className="h-10" onClick={() => router.push(`/student/courses/${course.id}`)}>
                          <Play size={14} className="mr-2 fill-current" /> Continue
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--color-border)]">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={14} className="fill-current" />
                          <span className="text-sm font-black text-[var(--color-text-primary)]">{course.rating ?? '4.8'}</span>
                        </div>
                        {enrolledCourseIds.has(course.id) && (course.is_free || confirmedPaymentCourseIds.has(course.id)) ? (
                          <Button size="sm" className="h-9 px-5" onClick={() => router.push(`/student/courses/${course.id}`)}>
                            Open
                          </Button>
                        ) : pendingPaymentCourseIds.has(course.id) ? (
                          <Badge variant="warning" size="sm" className="h-9 px-4 flex items-center gap-1.5 font-black uppercase tracking-wider">
                            <Clock size={12} className="animate-pulse" /> Pending
                          </Badge>
                        ) : enrolledCourseIds.has(course.id) && !course.is_free ? (
                          <Button size="sm" className="h-9 px-5 bg-amber-500 hover:bg-amber-600 text-white border-none shadow-md font-bold" onClick={() => router.push(`/student/courses/${course.id}`)}>
                            Pay Now
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            className="h-9 px-5" 
                            loading={enrolling && (selectedCourseForPayment?.id === course.id || enrollingId === course.id)} 
                            onClick={() => {
                              if (course.is_free) {
                                setEnrollingId(course.id);
                                enrollCourse(course.id, {
                                  onSettled: () => setTimeout(() => setEnrollingId(null), 500)
                                });
                              } else {
                                setSelectedCourseForPayment(course);
                                setShowPaymentModal(true);
                              }
                            }}
                          >
                            {course.is_free ? 'Enroll Free' : 'Unlock & Enroll'}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Events Tab */}
      {activeTab === 'events' && (
        <AnimatePresence mode="wait">
          {loadingEvents ? (
            <motion.div key="events-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="p-8 h-56 animate-pulse bg-[var(--color-bg-card)]/40 rounded-3xl border border-[var(--color-border)]" />)}
            </motion.div>
          ) : filteredEvents.length === 0 ? (
            <motion.div key="events-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 bg-[var(--color-bg-card)] rounded-3xl border border-dashed border-[var(--color-border)]">
              <div className="w-20 h-20 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar size={32} className="text-[var(--color-text-secondary)]/40" />
              </div>
              <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No upcoming events</h3>
              <p className="text-[var(--color-text-secondary)] mt-2">Check back later for upcoming webinars and workshops.</p>
            </motion.div>
          ) : (
            <motion.div key="events-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event: any, idx: number) => {
                const isFull = event.current_attendees >= event.max_attendees;
                const isRegistered = event.is_registered;
                const isOngoing = event.actual_status === 'ongoing' || event.status === 'ongoing';
                const isPast = event.actual_status === 'completed' || new Date(event.start_time) < new Date();
                const seatsLeft = event.max_attendees - event.current_attendees;
                return (
                  <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                    <Card className="p-0 overflow-hidden hover:shadow-2xl transition-all group border border-[var(--color-border)]">
                      {/* Banner */}
                      <div className="h-36 relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5">
                        {event.banner_url ? (
                          <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Calendar size={48} className="text-[var(--color-primary)]/30" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                            isPast ? 'bg-gray-500 text-white' :
                            isOngoing ? 'bg-red-500 text-white animate-pulse' :
                            'bg-green-500/90 text-white'
                          }`}>
                            {isPast ? 'Completed' : isOngoing ? '🔴 Ongoing' : event.event_type}
                          </span>
                        </div>
                        {isRegistered && (
                          <div className="absolute top-3 left-3">
                            <span className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest bg-white/90 text-green-700 px-2 py-1 rounded-full">
                              <CheckCircle2 size={10} /> Registered
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="font-black text-[var(--color-text-primary)] text-lg leading-tight mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">{event.description}</p>

                        <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-bold text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-[var(--color-primary)]" />{format(new Date(event.start_time), 'MMM dd, h:mm a')}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[var(--color-primary)]" />{event.location || 'Online'}</span>
                          <span className="flex items-center gap-1.5"><Globe size={12} className="text-[var(--color-primary)]" />{event.is_online ? 'Virtual' : 'In-person'}</span>
                          <span className={`flex items-center gap-1.5 ${isFull ? 'text-red-500' : seatsLeft <= 10 ? 'text-amber-600' : ''}` }>
                            <Users size={12} className={isFull ? 'text-red-500' : 'text-[var(--color-primary)]'} />
                            {isFull ? 'Full' : `${seatsLeft} seats left`} / {event.max_attendees}
                          </span>
                        </div>

                        {/* Capacity Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-[10px] font-bold text-[var(--color-text-secondary)] mb-1">
                            <span>Seats Filled</span>
                            <span>{event.current_attendees}/{event.max_attendees}</span>
                          </div>
                          <div className="h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isFull ? 'bg-red-500' : seatsLeft <= 10 ? 'bg-amber-500' : 'bg-[var(--color-primary)]'
                              }`}
                              style={{ width: `${Math.min(100, (event.current_attendees / event.max_attendees) * 100)}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {isRegistered ? (
                            <>
                              {event.meeting_link && isOngoing && (
                                <a
                                  href={event.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm shadow-lg shadow-red-500/30 transition-all hover:scale-105"
                                >
                                  <Radio size={14} /> Join Now
                                </a>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 border-red-200 text-red-500 hover:bg-red-50 rounded-xl h-10"
                                loading={unregistering && registeringEventId === event.id}
                                onClick={() => {
                                  setRegisteringEventId(event.id);
                                  unregisterFromEvent(event.id, { onSettled: () => setRegisteringEventId(null) });
                                }}
                              >
                                Cancel Registration
                              </Button>
                            </>
                          ) : (
                            <Button
                              fullWidth
                              size="sm"
                              className="h-10 rounded-xl"
                              disabled={isFull || isOngoing || isPast}
                              loading={registering && registeringEventId === event.id}
                              onClick={() => {
                                setRegisteringEventId(event.id);
                                registerForEvent(event.id, { onSettled: () => setRegisteringEventId(null) });
                              }}
                            >
                              {isPast ? 'Event Completed' : isFull ? 'No Seats Available' : isOngoing ? 'Registration Closed' : 'Register Now'}
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {selectedCourseForPayment && (
        <CoursePaymentModal
          course={selectedCourseForPayment}
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedCourseForPayment(null);
          }}
        />
      )}
    </div>
  );
}
