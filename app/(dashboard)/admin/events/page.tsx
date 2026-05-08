'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Calendar, Plus, MapPin, Clock, Edit2, LayoutGrid, Trash2, Globe, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/lib/hooks/useEvents';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function AdminEventsPage() {
  const { data: eventsData, isLoading } = useEvents();
  const { mutate: createEvent, isPending: isCreating } = useCreateEvent();
  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEvent();
  const { mutate: deleteEvent } = useDeleteEvent();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const eventList = useMemo(() => {
    return Array.isArray(eventsData) ? eventsData : (eventsData as any)?.data || [];
  }, [eventsData]);

  const onCreateEvent = (data: any) => {
    const payload = {
      ...data,
      start_time: new Date(`${data.date}T${data.time}`).toISOString(),
      end_time: new Date(`${data.date}T${data.time}`).toISOString(), // Simplified for now
      max_attendees: parseInt(data.max_attendees) || 100,
      is_online: data.location.toLowerCase().includes('virtual') || data.location.toLowerCase().includes('zoom'),
    };
    
    createEvent(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const onUpdateEvent = (data: any) => {
    if (!selectedEvent) return;
    
    const payload = {
      ...data,
      start_time: new Date(`${data.date}T${data.time}`).toISOString(),
      end_time: new Date(`${data.date}T${data.time}`).toISOString(),
      max_attendees: parseInt(data.max_attendees) || 100,
      is_online: data.location.toLowerCase().includes('virtual') || data.location.toLowerCase().includes('zoom'),
    };

    updateEvent({ id: selectedEvent.id, data: payload }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedEvent(null);
      }
    });
  };

  const openEditModal = (event: any) => {
    setSelectedEvent(event);
    const startDate = new Date(event.start_time);
    
    setValue('title', event.title);
    setValue('description', event.description || '');
    setValue('date', format(startDate, 'yyyy-MM-dd'));
    setValue('time', format(startDate, 'HH:mm'));
    setValue('location', event.location);
    setValue('event_type', event.event_type);
    setValue('max_attendees', event.max_attendees);
    setValue('status', event.status);
    setValue('speaker_name', event.speaker_name || '');
    
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Events <span className="text-[var(--color-primary)]">Manager</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Schedule and oversee workshops, hiring events, and webinars.
          </p>
        </div>
        <Button 
          onClick={() => {
            reset();
            setIsModalOpen(true);
          }}
          size="lg" 
          className="rounded-2xl shadow-xl shadow-[var(--color-primary)]/20"
        >
          <Plus size={20} className="mr-2" /> Create Event
        </Button>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="p-8 h-64 animate-pulse bg-[var(--color-bg-card)]/40" />
          ))}
        </div>
      ) : eventList.length === 0 ? (
        <Card className="p-20 text-center bg-[var(--color-bg-card)]/40">
          <p className="text-[var(--color-text-secondary)] font-bold text-xl text-center w-full">No events scheduled yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {eventList.map((event: any, idx: number) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-2xl transition-all border border-[var(--color-border)] bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2rem] group flex flex-col">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                      <Calendar size={28} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl bg-[var(--color-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                        {event.event_type}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                        event.status === 'scheduled' ? 'bg-green-500/10 text-green-500' : 
                        event.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-500'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-4 tracking-tight leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium mb-6 line-clamp-2">
                    {event.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] font-bold">
                      <Clock size={16} className="text-[var(--color-primary)]" />
                      {format(new Date(event.start_time), 'MMM dd, p')}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] font-bold">
                      <MapPin size={16} className="text-[var(--color-primary)]" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] font-bold">
                      <Users size={16} className="text-[var(--color-primary)]" />
                      {event.registration_count || 0} / {event.max_attendees}
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)] font-bold">
                      <Globe size={16} className="text-[var(--color-primary)]" />
                      {event.is_online ? 'Online' : 'On-site'}
                    </div>
                  </div>

                  <div className="mt-auto space-y-3">
                    <Button 
                      variant="primary" 
                      onClick={() => router.push(`/admin/events/${event.id}/registrations`)}
                      className="w-full rounded-2xl h-12 font-black text-xs uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20"
                    >
                      <Users size={16} className="mr-2" /> View Registrations
                    </Button>
                    {event.actual_status !== 'completed' && event.status !== 'completed' && (
                      <div className="flex gap-4">
                        <Button 
                          variant="outline" 
                          onClick={() => openEditModal(event)}
                          className="flex-1 rounded-2xl h-12 border-2 font-black text-xs uppercase tracking-widest hover:bg-[var(--color-primary)]/5"
                        >
                          <Edit2 size={16} className="mr-2" /> Edit
                        </Button>
                        <button 
                          onClick={() => handleDelete(event.id)}
                          className="w-12 h-12 rounded-2xl border-2 border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Event Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Event">
        <form onSubmit={handleSubmit(onCreateEvent)} className="space-y-6 pt-4">
          <Input label="Event Title" placeholder="e.g. Annual Tech Summit" {...register('title', { required: true })} />
          <Input label="Description" placeholder="What is this event about?" {...register('description', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" {...register('date', { required: true })} />
            <Input label="Time" type="time" {...register('time', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location / Platform" placeholder="e.g. Zoom or Office Address" {...register('location', { required: true })} />
            <Input label="Max Attendees" type="number" defaultValue="100" {...register('max_attendees')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Event Type" 
              options={[
                { value: 'webinar', label: 'Webinar' },
                { value: 'workshop', label: 'Workshop' },
                { value: 'seminar', label: 'Seminar' },
                { value: 'networking', label: 'Networking' },
              ]} 
              {...register('event_type')} 
            />
            <Select 
              label="Status" 
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'scheduled', label: 'Scheduled' },
              ]} 
              {...register('status')} 
            />
          </div>
          <Input label="Speaker Name" placeholder="Who is speaking?" {...register('speaker_name')} />
          
          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" loading={isCreating} className="flex-1 rounded-xl shadow-lg shadow-[var(--color-primary)]/20">Create Event</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Event Details">
        <form onSubmit={handleSubmit(onUpdateEvent)} className="space-y-6 pt-4">
          <Input label="Event Title" {...register('title', { required: true })} />
          <Input label="Description" {...register('description', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" {...register('date', { required: true })} />
            <Input label="Time" type="time" {...register('time', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Location / Platform" {...register('location', { required: true })} />
            <Input label="Max Attendees" type="number" {...register('max_attendees')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Event Type" 
              options={[
                { value: 'webinar', label: 'Webinar' },
                { value: 'workshop', label: 'Workshop' },
                { value: 'seminar', label: 'Seminar' },
                { value: 'networking', label: 'Networking' },
              ]} 
              {...register('event_type')} 
            />
            <Select 
              label="Status" 
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'ongoing', label: 'Ongoing' },
                { value: 'completed', label: 'Completed' },
              ]} 
              {...register('status')} 
            />
          </div>
          <Input label="Speaker Name" {...register('speaker_name')} />
          
          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" loading={isUpdating} className="flex-1 rounded-xl shadow-lg shadow-[var(--color-primary)]/20">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
