'use client';

import { useEvent, useEventRegistrations } from '@/lib/hooks/useEvents';
import { useDeleteRegistration } from '@/lib/hooks/useEvents';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { ChevronLeft, Mail, Phone, User, Calendar, MapPin, Clock, Trash2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/Badge';

export default function EventRegistrationsPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.id as string);

  const { data: event, isLoading: isLoadingEvent } = useEvent(eventId);
  const { data: registrationsData, isLoading: isLoadingRegs } = useEventRegistrations(eventId);
  const { mutate: deleteRegistration, isPending: isDeletingReg } = useDeleteRegistration();

  const eventData = event?.data || event;
  const registrations = registrationsData?.data || registrationsData || [];

  const safeDateFormat = (dateStr: string, formatStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return format(date, formatStr);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  if (isLoadingEvent) return <div className="p-8"><TableSkeleton /></div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()} className="rounded-xl">
          <ChevronLeft size={20} />
        </Button>
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">
            Event <span className="text-[var(--color-primary)]">Registrations</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] font-medium">
            Manage attendees for {eventData?.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Details Card */}
        <Card className="p-6 h-fit bg-[var(--color-bg-card)]/40 border-[var(--color-border)] rounded-[2rem] shadow-xl backdrop-blur-md">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-[var(--color-primary)]" /> Event Summary
          </h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Clock size={16} className="text-[var(--color-text-secondary)]" />
              <span className="font-bold">{safeDateFormat(eventData?.start_time, 'MMM dd, yyyy · HH:mm')}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-[var(--color-text-secondary)]" />
              <span className="font-medium">{eventData?.location}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Users size={16} className="text-[var(--color-text-secondary)]" />
              <span className="font-medium">{registrations.length} / {eventData?.max_attendees} Registered</span>
            </div>
            <div className="pt-4 border-t border-[var(--color-border)]">
              <Badge variant={eventData?.status === 'scheduled' ? 'primary' : 'secondary'}>
                {eventData?.status}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Registrations List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-8 bg-[var(--color-bg-card)]/40 border-[var(--color-border)] rounded-[2rem] shadow-xl backdrop-blur-md">
            <h2 className="text-xl font-black mb-6">Attendee List</h2>
            
            {isLoadingRegs ? (
              <TableSkeleton />
            ) : registrations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-[var(--color-text-secondary)] opacity-50" />
                </div>
                <p className="text-[var(--color-text-secondary)] font-medium">No registrations yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] border-b border-[var(--color-border)]">
                      <th className="pb-4 px-4">Student</th>
                      <th className="pb-4 px-4">Contact</th>
                      <th className="pb-4 px-4 text-center">Date</th>
                      <th className="pb-4 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)]">
                    {registrations.map((reg: any) => (
                      <tr key={reg.id} className="group hover:bg-[var(--color-primary)]/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] font-black">
                              {reg.user_name?.[0] || reg.user_email?.[0] || 'S'}
                            </div>
                            <div>
                              <p className="font-bold text-[var(--color-text-primary)]">{reg.user_name || 'Student'}</p>
                              <p className="text-xs text-[var(--color-text-secondary)] font-medium">{reg.user_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                              <Mail size={12} /> {reg.user_email}
                            </div>
                            {reg.user_phone && (
                              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                                <Phone size={12} /> {reg.user_phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">
                            {safeDateFormat(reg.registration_date, 'MMM dd, yyyy')}
                          </p>
                          <p className="text-[10px] text-[var(--color-text-secondary)] font-bold opacity-60 text-center">
                            {safeDateFormat(reg.registration_date, 'HH:mm')}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {eventData?.status !== 'completed' && eventData?.actual_status !== 'completed' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:bg-red-50 rounded-xl"
                              onClick={() => {
                                if (confirm('Are you sure you want to cancel this student\'s registration?')) {
                                  deleteRegistration(reg.id);
                                }
                              }}
                            >
                              <Trash2 size={16} className="mr-1" /> Remove
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function Users(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
