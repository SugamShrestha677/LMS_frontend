'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Calendar, Plus, MapPin, Clock, Edit2, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AdminEventsPage() {
  const [events, setEvents] = useState([
    { id: 1, title: 'Annual Tech Summit 2024', date: '2024-05-15', time: '10:00 AM', location: 'Virtual / Main Hall', type: 'Workshop' },
    { id: 2, title: 'Hiring Day: Fintech Sector', date: '2024-06-02', time: '09:00 AM', location: 'Lalitpur Office', type: 'Hiring' },
    { id: 3, title: 'Design Thinking Workshop', date: '2024-06-10', time: '02:00 PM', location: 'Zoom', type: 'Learning' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const { register, handleSubmit, reset, setValue } = useForm();

  const onCreateEvent = (data: any) => {
    const newEvent = {
      ...data,
      id: events.length + 1,
    };
    setEvents([...events, newEvent]);
    toast.success('Event created successfully!');
    setIsModalOpen(false);
    reset();
  };

  const onUpdateEvent = (data: any) => {
    setEvents(events.map(e => e.id === selectedEvent.id ? { ...e, ...data } : e));
    toast.success('Event updated successfully!');
    setIsEditModalOpen(false);
    setSelectedEvent(null);
  };

  const openEditModal = (event: any) => {
    setSelectedEvent(event);
    setValue('title', event.title);
    setValue('date', event.date);
    setValue('time', event.time);
    setValue('location', event.location);
    setValue('type', event.type);
    setIsEditModalOpen(true);
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {events.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="p-8 h-full hover:shadow-2xl transition-all border border-[var(--color-border)] bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2rem] group">
                <div className="flex justify-between items-start mb-8">
                  <div className="p-4 rounded-2xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                    <Calendar size={28} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl bg-[var(--color-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                    {event.type}
                  </span>
                </div>
                
                <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-6 tracking-tight leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                  {event.title}
                </h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] font-bold">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                      <Clock size={16} />
                    </div>
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] font-bold">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/5 flex items-center justify-center text-[var(--color-primary)]">
                      <MapPin size={16} />
                    </div>
                    {event.location}
                  </div>
                </div>

                <div className="mt-auto flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => openEditModal(event)}
                    className="flex-1 rounded-2xl h-12 border-2 font-black text-xs uppercase tracking-widest hover:bg-[var(--color-primary)]/5"
                  >
                    <Edit2 size={16} className="mr-2" /> Edit
                  </Button>
                  <Button 
                    onClick={() => toast.info('Management console for ' + event.title + ' is coming soon.')}
                    className="flex-1 rounded-2xl h-12 font-black text-xs uppercase tracking-widest shadow-lg shadow-[var(--color-primary)]/20"
                  >
                    <LayoutGrid size={16} className="mr-2" /> Manage
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Create Event Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule New Event">
        <form onSubmit={handleSubmit(onCreateEvent)} className="space-y-6 pt-4">
          <Input label="Event Title" placeholder="e.g. Annual Tech Summit" {...register('title', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" {...register('date', { required: true })} />
            <Input label="Time" type="text" placeholder="e.g. 10:00 AM" {...register('time', { required: true })} />
          </div>
          <Input label="Location" placeholder="e.g. Virtual / Office" {...register('location', { required: true })} />
          <Select 
            label="Event Type" 
            options={[
              { value: 'Workshop', label: 'Workshop' },
              { value: 'Hiring', label: 'Hiring Event' },
              { value: 'Learning', label: 'Learning Session' },
              { value: 'Networking', label: 'Networking' },
            ]} 
            {...register('type')} 
          />
          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl shadow-lg shadow-[var(--color-primary)]/20">Create Event</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Event Details">
        <form onSubmit={handleSubmit(onUpdateEvent)} className="space-y-6 pt-4">
          <Input label="Event Title" {...register('title', { required: true })} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" {...register('date', { required: true })} />
            <Input label="Time" type="text" {...register('time', { required: true })} />
          </div>
          <Input label="Location" {...register('location', { required: true })} />
          <Select 
            label="Event Type" 
            options={[
              { value: 'Workshop', label: 'Workshop' },
              { value: 'Hiring', label: 'Hiring Event' },
              { value: 'Learning', label: 'Learning Session' },
              { value: 'Networking', label: 'Networking' },
            ]} 
            {...register('type')} 
          />
          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" className="flex-1 rounded-xl shadow-lg shadow-[var(--color-primary)]/20">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
