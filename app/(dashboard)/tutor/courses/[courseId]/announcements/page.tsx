'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement, useCourse } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, Trash2, Megaphone, Clock, User, 
  ChevronLeft, Send, AlertCircle, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AnnouncementsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { data: courseData } = useCourse(courseId);
  const { data: announcementsData, isLoading } = useAnnouncements(courseId);
  const { mutate: createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const course = Array.isArray(courseData) ? courseData[0] : courseData;
  const announcements = Array.isArray(announcementsData) 
    ? announcementsData 
    : (announcementsData as any)?.data || [];
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm({
    defaultValues: { title: '', content: '' }
  });

  const onSubmit = (data: any) => {
    if (!data.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!data.content.trim()) {
      toast.error('Content is required');
      return;
    }

    createAnnouncement(
      { 
        courseId, 
        data: {
          title: data.title.trim(),
          content: data.content.trim(),
        }
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
          toast.success('Announcement posted successfully!');
        },
      }
    );
  };

  const handleDelete = (announcementId: number, title: string) => {
    if (confirm(`Delete announcement "${title}"?`)) {
      deleteAnnouncement({ courseId, announcementId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="text-[#0A5C4A] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => router.push(`/tutor/courses/${courseId}`)}
            className="flex items-center gap-1 text-sm font-semibold text-[#5A5A6E] hover:text-[#0A5C4A] mb-3 transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Course
          </button>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] flex items-center gap-3">
            <Megaphone size={28} className="text-[var(--color-primary)]" />
            Announcements
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {course?.title || 'Course'} - Communicate with your enrolled students
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-sm">
            {announcements.length} Announcement{announcements.length !== 1 ? 's' : ''}
          </Badge>
          <Button onClick={() => setIsModalOpen(true)} size="lg">
            <Plus size={18} className="mr-2" /> Create Announcement
          </Button>
        </div>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Card className="p-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone size={32} className="text-[#5A5A6E] opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">No announcements yet</h3>
          <p className="text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
            Keep your students informed by posting announcements about course updates, deadlines, or important information.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={16} className="mr-2" /> Post First Announcement
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {announcements.map((announcement: any, idx: number) => (
              <motion.div
                key={announcement.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-[var(--color-text-primary)] mb-2">
                        {announcement.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] whitespace-pre-wrap text-sm leading-relaxed">
                        {announcement.content}
                      </p>
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-xs text-[#5A5A6E]">
                          <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                            <User size={12} className="text-gray-500" />
                          </div>
                          <span className="font-semibold">{announcement.created_by_name || 'Admin'}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-[#5A5A6E]">
                          <Clock size={12} />
                          <span>
                            {announcement.created_at 
                              ? format(new Date(announcement.created_at), 'MMM dd, yyyy - h:mm a')
                              : 'Just now'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(announcement.id, announcement.title)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600 flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Modal */}
      <Modal 
        open={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }} 
        title="Create Announcement"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-4">
          <div>
            <Input
              label="Title"
              placeholder="e.g., Important Update for Module 2"
              {...register('title', { required: 'Title is required' })}
              error={errors.title?.message}
            />
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1E1E2A]">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={6}
              placeholder="Write your announcement here..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] resize-none transition-all"
            />
            {errors.content?.message && (
              <p className="text-sm text-red-500 mt-1">{errors.content.message as string}</p>
            )}
          </div>

          <div className="p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              This announcement will be visible to all students enrolled in this course.
            </p>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }} 
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={isCreating} 
              className="flex-1"
            >
              <Send size={16} className="mr-2" />
              Post Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}