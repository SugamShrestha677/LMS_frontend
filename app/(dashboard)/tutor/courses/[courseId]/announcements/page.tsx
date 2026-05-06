'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Plus, Trash2, Megaphone, Clock } from 'lucide-react';
import { format } from 'date-fns';

export default function AnnouncementsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { data: announcementsData, isLoading } = useAnnouncements(courseId);
  const { mutate: createAnnouncement, isPending: isCreating } = useCreateAnnouncement();
  const { mutate: deleteAnnouncement } = useDeleteAnnouncement();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const announcements = Array.isArray(announcementsData) ? announcementsData : (announcementsData as any)?.data || [];
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { title: '', content: '' }
  });

  const onSubmit = (data: any) => {
    createAnnouncement(
      { courseId, data },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          reset();
        }
      }
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Announcements</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Communicate with your enrolled students</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={18} className="mr-2" /> Create Announcement
        </Button>
      </div>

      {announcements.length === 0 ? (
        <Card className="p-12 text-center">
          <Megaphone size={48} className="text-[var(--color-text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">No announcements yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement: any) => (
            <Card key={announcement.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-[var(--color-text-primary)]">{announcement.title}</h3>
                  <p className="text-[var(--color-text-secondary)] mt-2 whitespace-pre-wrap">{announcement.content}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--color-text-secondary)]">
                    <span>By: {announcement.created_by_name}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(announcement.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAnnouncement({ courseId, announcementId: announcement.id })}
                  className="text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Announcement">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <Input
            label="Title"
            placeholder="Announcement title"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          <div className="space-y-1">
            <label className="block text-sm font-semibold">Content</label>
            <textarea
              {...register('content', { required: 'Content is required' })}
              rows={5}
              placeholder="Write your announcement..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A]"
            />
            {errors.content?.message && (
              <p className="text-sm text-red-500">{errors.content.message as string}</p>
            )}
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" loading={isCreating} className="flex-1">
              Post Announcement
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}