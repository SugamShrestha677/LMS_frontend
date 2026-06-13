'use client';

import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { useEvents, useRegisterForEvent, useUnregisterFromEvent } from '@/lib/hooks/useEvents';
import { useAuthStore } from '@/lib/store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, Clock, Globe, Users, Sparkles,
  CheckCircle2, ExternalLink, Mic2, Video
} from 'lucide-react';
import { format } from 'date-fns';

const typeIcons: Record<string, React.ReactNode> = {
  webinar: <Video size={20} />,
  workshop: <Sparkles size={20} />,
  seminar: <Mic2 size={20} />,
  networking: <Users size={20} />,
};

const statusColors: Record<string, string> = {
  scheduled: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  ongoing: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  draft: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
};

export default function StudentEventsPage() {
  const { user } = useAuthStore();
  const { data: eventsData, isLoading } = useEvents();
  const { mutate: registerForEvent, isPending: isRegistering } = useRegisterForEvent();
  const { mutate: unregisterFromEvent, isPending: isUnregistering } = useUnregisterFromEvent();

  // Safely extract the events array from the API envelope
  const events = useMemo(() => {
    if (!eventsData) return [];
    if (Array.isArray(eventsData)) return eventsData;
    if (Array.isArray((eventsData as any)?.data)) return (eventsData as any).data;
    return [];
  }, [eventsData]);

  // Separate into upcoming and past
  const { upcoming, past } = useMemo(() => {
    const now = new Date();
    const upcomingEvents: any[] = [];
    const pastEvents: any[] = [];

    events.forEach((event: any) => {
      const actualStatus = event.actual_status || event.status;
      if (actualStatus === 'completed') {
        pastEvents.push(event);
      } else {
        upcomingEvents.push(event);
      }
    });

    // Sort upcoming by start_time ascending
    upcomingEvents.sort((a: any, b: any) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );

    return { upcoming: upcomingEvents, past: pastEvents };
  }, [events]);

  if (isLoading) {
    return (
      <div className="space-y-8 pb-12">
        <div className="p-8 rounded-[2rem] bg-[var(--color-bg-card)]/40 border border-[var(--color-border)]">
          <Skeleton className="h-8 w-64 mb-2" rounded="lg" />
          <Skeleton className="h-4 w-96" rounded="lg" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-72 w-full" rounded="lg" />
          ))}
        </div>
      </div>
    );
  }

  const renderEventCard = (event: any, idx: number) => {
    const actualStatus = event.actual_status || event.status;
    const isCompleted = actualStatus === 'completed';
    const isOngoing = actualStatus === 'ongoing';
    const spotsLeft = event.max_attendees - (event.registration_count || event.current_attendees || 0);
    const isFull = spotsLeft <= 0;

    return (
      <motion.div
        key={event.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: idx * 0.06, type: 'spring', stiffness: 260, damping: 20 }}
      >
        <Card className={`p-0 overflow-hidden h-full border border-[var(--color-border)] rounded-[2rem] group transition-all duration-300 ${
          isCompleted
            ? 'opacity-70 hover:opacity-90'
            : 'hover:shadow-2xl hover:shadow-[var(--color-primary)]/5 hover:-translate-y-1'
        }`}>
          {/* Top gradient strip */}
          <div className={`h-1.5 ${
            isOngoing
              ? 'bg-gradient-to-r from-blue-500 to-cyan-400'
              : isCompleted
                ? 'bg-gradient-to-r from-gray-400 to-gray-300'
                : 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]'
          }`} />

          <div className="p-8 flex flex-col h-full">
            {/* Header row */}
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${
                  isOngoing
                    ? 'bg-blue-500/10 text-blue-500'
                    : 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                } group-hover:scale-110 transition-transform`}>
                  {typeIcons[event.event_type] || <Calendar size={20} />}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                    {event.event_type}
                  </span>
                  {event.speaker_name && (
                    <p className="text-xs font-bold text-[var(--color-text-secondary)] mt-0.5 flex items-center gap-1">
                      <Mic2 size={10} /> {event.speaker_name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border ${statusColors[actualStatus] || statusColors.scheduled}`}>
                  {isOngoing ? '● Live Now' : actualStatus}
                </span>
                {event.is_registered && (
                  <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 size={10} /> Registered
                  </span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-3 tracking-tight leading-tight group-hover:text-[var(--color-primary)] transition-colors">
              {event.title}
            </h3>

            {/* Description */}
            {event.description && (
              <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-6 line-clamp-2 leading-relaxed">
                {event.description}
              </p>
            )}

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] font-bold bg-[var(--color-muted)] px-3 py-2.5 rounded-xl border border-[var(--color-border)]">
                <Clock size={14} className="text-[var(--color-primary)] shrink-0" />
                <span className="truncate">
                  {format(new Date(event.start_time), 'MMM dd, h:mm a')}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] font-bold bg-[var(--color-muted)] px-3 py-2.5 rounded-xl border border-[var(--color-border)]">
                <MapPin size={14} className="text-[var(--color-primary)] shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] font-bold bg-[var(--color-muted)] px-3 py-2.5 rounded-xl border border-[var(--color-border)]">
                <Users size={14} className="text-[var(--color-primary)] shrink-0" />
                <span className="truncate">
                  {event.registration_count || event.current_attendees || 0} / {event.max_attendees} seats
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[var(--color-text-secondary)] font-bold bg-[var(--color-muted)] px-3 py-2.5 rounded-xl border border-[var(--color-border)]">
                <Globe size={14} className="text-[var(--color-primary)] shrink-0" />
                <span>{event.is_online ? 'Online' : 'On-site'}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-auto space-y-3">
              {isCompleted ? (
                <div className="text-center py-3 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)]">
                  <span className="text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                    Event Concluded
                  </span>
                </div>
              ) : event.is_registered ? (
                <div className="flex gap-3">
                  {event.is_online && event.meeting_link && (
                    <a
                      href={event.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1"
                    >
                      <Button
                        variant="primary"
                        fullWidth
                        className="rounded-2xl h-12 font-black text-xs uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20"
                      >
                        <ExternalLink size={14} className="mr-2" /> Join Event
                      </Button>
                    </a>
                  )}
                  {actualStatus === 'scheduled' && (
                    <Button
                      variant="outline"
                      onClick={() => unregisterFromEvent(event.id)}
                      disabled={isUnregistering}
                      className={`${event.is_online && event.meeting_link ? '' : 'flex-1'} rounded-2xl h-12 border-2 font-black text-xs uppercase tracking-widest hover:border-red-500 hover:text-red-500`}
                    >
                      Cancel Registration
                    </Button>
                  )}
                </div>
              ) : (
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => registerForEvent(event.id)}
                  disabled={isRegistering || isFull}
                  className="rounded-2xl h-12 font-black text-xs uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20"
                >
                  {isFull ? 'Event Full' : 'Register Now'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Upcoming <span className="text-[var(--color-primary)]">Events</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Discover workshops, webinars, and networking opportunities.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm font-bold text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2 bg-[var(--color-muted)] px-4 py-2 rounded-xl border border-[var(--color-border)]">
            <Calendar size={16} className="text-[var(--color-primary)]" />
            <span>{upcoming.length} upcoming</span>
          </div>
          {past.length > 0 && (
            <div className="flex items-center gap-2 bg-[var(--color-muted)] px-4 py-2 rounded-xl border border-[var(--color-border)]">
              <CheckCircle2 size={16} className="text-gray-400" />
              <span>{past.length} past</span>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      {upcoming.length === 0 && past.length === 0 ? (
        <Card className="p-20 text-center bg-[var(--color-bg-card)]/40 rounded-[2rem]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
              <Calendar size={36} className="text-[var(--color-primary)]" />
            </div>
            <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">No Events Yet</h3>
            <p className="text-[var(--color-text-secondary)] font-medium max-w-md">
              There are no events scheduled at the moment. Check back later for workshops, webinars, and more.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {upcoming.map((event: any, idx: number) => renderEventCard(event, idx))}
              </AnimatePresence>
            </div>
          )}

          {/* Past Events */}
          {past.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight flex items-center gap-3">
                <CheckCircle2 size={22} className="text-gray-400" />
                Past Events
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {past.map((event: any, idx: number) => renderEventCard(event, idx))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}