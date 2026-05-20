'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Globe, 
  CheckCircle2, 
  Radio, 
  Search,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents, useRegisterForEvent, useUnregisterFromEvent } from '@/lib/hooks/useEvents';
import { format } from 'date-fns';

export default function StudentEventsPage() {
  const { data: eventsData, isLoading: loadingEvents } = useEvents();
  const { mutate: registerForEvent, isPending: registering } = useRegisterForEvent();
  const { mutate: unregisterFromEvent, isPending: unregistering } = useUnregisterFromEvent();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [registeringEventId, setRegisteringEventId] = useState<number | null>(null);

  const eventList = Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data || [];

  const filteredEvents = eventList.filter((event: any) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || event.event_type?.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <Card className="p-8 bg-[var(--color-bg-card)]/60 border-[var(--color-border)] rounded-[2rem] shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
              Upcoming <span className="text-[var(--color-primary)]">Events</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
              Join workshops, webinars, and networking events to boost your skills.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-bg)]/50 p-2 rounded-2xl border border-[var(--color-border)]">
            <div className="px-4 py-2 text-center border-r border-[var(--color-border)]">
              <p className="text-[10px] font-black uppercase text-[var(--color-text-secondary)]">Total</p>
              <p className="text-xl font-black text-[var(--color-primary)]">{eventList.length}</p>
            </div>
            <div className="px-4 py-2 text-center">
              <p className="text-[10px] font-black uppercase text-[var(--color-text-secondary)]">Registered</p>
              <p className="text-xl font-black text-green-600">
                {eventList.filter((e: any) => e.is_registered).length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 group">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] group-focus-within:text-[var(--color-primary)] transition-colors" />
          <input
            type="text"
            placeholder="Search events, webinars, workshops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-6 py-4 rounded-[1.5rem] border-2 border-[var(--color-border)] bg-[var(--color-bg-card)]/60 text-sm font-bold outline-none focus:border-[var(--color-primary)]/40 focus:ring-4 focus:ring-[var(--color-primary)]/10 transition-all shadow-sm"
          />
        </div>
        <div className="flex items-center gap-3 bg-[var(--color-bg-card)]/60 p-2 rounded-[1.5rem] border-2 border-[var(--color-border)] shadow-sm">
          <Filter size={18} className="ml-2 text-[var(--color-text-secondary)]" />
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-transparent border-none text-sm font-bold outline-none pr-4 text-[var(--color-text-primary)]"
          >
            <option value="all">All Types</option>
            <option value="webinar">Webinars</option>
            <option value="workshop">Workshops</option>
            <option value="networking">Networking</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loadingEvents ? (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-96 rounded-[2rem] bg-[var(--color-bg-card)]/40 animate-pulse border border-[var(--color-border)]" />
            ))}
          </motion.div>
        ) : filteredEvents.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-24 bg-[var(--color-bg-card)]/40 rounded-[3rem] border-2 border-dashed border-[var(--color-border)]">
            <div className="w-24 h-24 bg-[var(--color-muted)] rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar size={40} className="text-[var(--color-text-secondary)]/40" />
            </div>
            <h3 className="text-2xl font-black text-[var(--color-text-primary)]">No events found</h3>
            <p className="text-[var(--color-text-secondary)] mt-2 font-medium max-w-sm mx-auto">
              We couldn&apos;t find any events matching your search criteria. Try adjusting your filters.
            </p>
          </motion.div>
        ) : (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: any, idx: number) => {
              const isFull = event.current_attendees >= event.max_attendees;
              const isRegistered = event.is_registered;
              const isOngoing = event.actual_status === 'ongoing';
              const isPast = event.actual_status === 'completed';
              const seatsLeft = event.max_attendees - event.current_attendees;
              
              return (
                <motion.div 
                  key={event.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="p-0 overflow-hidden hover:shadow-2xl transition-all group border-2 border-[var(--color-border)] rounded-[2rem] flex flex-col h-full bg-[var(--color-bg-card)]/60">
                    {/* Event Banner */}
                    <div className="h-44 relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-primary)]/5">
                      {event.banner_url ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar size={64} className="text-[var(--color-primary)]/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Badge variant={isPast ? 'secondary' : isOngoing ? 'danger' : 'primary'} className={isOngoing ? 'animate-pulse' : ''}>
                          {isPast ? 'Completed' : isOngoing ? '🔴 Ongoing' : event.event_type}
                        </Badge>
                      </div>

                      {isRegistered && (
                        <div className="absolute top-4 left-4">
                          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest bg-green-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                            <CheckCircle2 size={12} /> Registered
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-black text-white text-xl leading-tight drop-shadow-md line-clamp-1">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-sm text-[var(--color-text-secondary)] font-medium line-clamp-2 mb-6 flex-1">
                        {event.description}
                      </p>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-bold text-[var(--color-text-secondary)]">
                            <Clock size={14} className="text-[var(--color-primary)]" />
                            {format(new Date(event.start_time), 'MMM dd, h:mm a')}
                          </div>
                          <div className="flex items-center gap-2 font-bold text-[var(--color-text-secondary)]">
                            <MapPin size={14} className="text-[var(--color-primary)]" />
                            {event.location || 'Online'}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-bold text-[var(--color-text-secondary)]">
                            <Globe size={14} className="text-[var(--color-primary)]" />
                            {event.is_online ? 'Virtual' : 'In-person'}
                          </div>
                          <div className={`flex items-center gap-2 font-bold ${isFull ? 'text-red-500' : 'text-[var(--color-text-secondary)]'}`}>
                            <Users size={14} className={isFull ? 'text-red-500' : 'text-[var(--color-primary)]'} />
                            {isFull ? 'Sold Out' : `${seatsLeft} seats left`}
                          </div>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] mb-2">
                          <span>Registration Progress</span>
                          <span>{event.current_attendees}/{event.max_attendees}</span>
                        </div>
                        <div className="h-2 bg-[var(--color-bg-secondary)] rounded-full overflow-hidden border border-[var(--color-border)]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (event.current_attendees / event.max_attendees) * 100)}%` }}
                            className={`h-full rounded-full transition-all ${
                              isFull ? 'bg-red-500' : seatsLeft <= 10 ? 'bg-amber-500' : 'bg-[var(--color-primary)]'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
                        {isRegistered ? (
                          <div className="flex flex-col gap-3">
                            {event.meeting_link && isOngoing && (
                              <a
                                href={event.meeting_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-500/30 transition-all hover:scale-[1.02] active:scale-95"
                              >
                                <Radio size={16} className="animate-pulse" /> Join Event
                              </a>
                            )}
                            {!isPast && (
                              <Button
                                variant="outline"
                                fullWidth
                                className="rounded-2xl h-12 border-2 text-red-500 border-red-100 hover:bg-red-50 font-black text-xs uppercase tracking-widest"
                                loading={unregistering && registeringEventId === event.id}
                                onClick={() => {
                                  setRegisteringEventId(event.id);
                                  unregisterFromEvent(event.id, { onSettled: () => setRegisteringEventId(null) });
                                }}
                              >
                                Cancel Registration
                              </Button>
                            )}
                          </div>
                        ) : (
                          <Button
                            fullWidth
                            className="rounded-2xl h-12 font-black text-xs uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20 active:scale-95 transition-transform"
                            disabled={isFull || isOngoing || isPast}
                            loading={registering && registeringEventId === event.id}
                            onClick={() => {
                              setRegisteringEventId(event.id);
                              registerForEvent(event.id, { onSettled: () => setRegisteringEventId(null) });
                            }}
                          >
                            {isPast ? 'Event Completed' : isFull ? 'Sold Out' : isOngoing ? 'Closed' : 'Register Now'}
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
    </div>
  );
}
