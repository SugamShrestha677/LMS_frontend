'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useUpdateModuleContent, useModuleContents } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const contentTypes = [
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'text', label: 'Text/Article' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'link', label: 'External Link' },
];

interface ContentFormData {
  title: string;
  content_type: string;
  description: string;
  file_url: string;
  video_url: string;
  external_link: string;
  body_text: string;
  order_number: number;
  duration_minutes: number;
  is_required: boolean;
  minimum_score: number;
}

export default function EditContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const moduleId = Number(params.moduleId);
  const contentId = Number(params.contentId);
  
  const { data: contentsData, isLoading } = useModuleContents(courseId, moduleId);
  const { mutate: updateContent, isPending } = useUpdateModuleContent();
  const [selectedType, setSelectedType] = useState('video');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContentFormData>();

  useEffect(() => {
    if (contentsData) {
      const contents = Array.isArray(contentsData) ? contentsData : (contentsData as any)?.data || [];
      const item = contents.find((c: any) => c.id === contentId);
      if (item) {
        reset({
          title: item.title,
          content_type: item.content_type,
          description: item.description || '',
          file_url: item.file_url || '',
          video_url: item.video_url || '',
          external_link: item.external_link || '',
          body_text: item.body_text || '',
          order_number: item.order_number,
          duration_minutes: item.duration_minutes,
          is_required: item.is_required,
          minimum_score: item.minimum_score || 0,
        });
        setSelectedType(item.content_type);
      }
    }
  }, [contentsData, contentId, reset]);

  const onSubmit = (data: ContentFormData) => {
    // Ensure the module association is preserved in the payload
    // We exclude content_type because many backends consider it read-only after creation
    const { content_type, ...rest } = data;
    const updatePayload = {
      ...rest,
      module: moduleId,
    };

    updateContent(
      { courseId, moduleId, contentId, data: updatePayload },
      { onSuccess: () => router.push(`/tutor/courses/${courseId}/modules/${moduleId}/contents`) }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Edit Content</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Update learning material details</p>
      </div>

      <Card className="p-8 max-w-3xl bg-[var(--color-bg-card)]/60 backdrop-blur-sm border-[var(--color-border)] rounded-[2rem]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Content Title"
            placeholder="e.g., Python Installation Tutorial"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />

          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-[var(--color-text-primary)] mb-2">Content Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedType === type.value
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)] shadow-sm'
                      : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/30'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('content_type')}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-bold">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[var(--color-text-primary)]">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief description..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          {/* Type-specific fields */}
          {selectedType === 'video' && (
            <Input
              label="Video URL"
              placeholder="https://youtube.com/watch?v=..."
              {...register('video_url')}
            />
          )}

          {selectedType === 'pdf' && (
            <Input
              label="PDF URL"
              placeholder="https://example.com/document.pdf"
              {...register('file_url')}
            />
          )}

          {selectedType === 'link' && (
            <Input
              label="External Link"
              placeholder="https://..."
              {...register('external_link')}
            />
          )}

          {selectedType === 'text' && (
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[var(--color-text-primary)]">Text Content</label>
              <textarea
                {...register('body_text')}
                rows={8}
                placeholder="Write your content here..."
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all font-mono text-sm leading-relaxed"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Order Number"
              type="number"
              {...register('order_number', { valueAsNumber: true, required: true })}
            />
            <Input
              label="Duration (min)"
              type="number"
              {...register('duration_minutes', { valueAsNumber: true })}
            />
            {(selectedType === 'quiz' || selectedType === 'assignment') && (
              <Input
                label="Min Score (%)"
                type="number"
                {...register('minimum_score', { valueAsNumber: true })}
              />
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-1">
            <input
              type="checkbox"
              {...register('is_required')}
              className="w-5 h-5 rounded-lg border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm font-bold text-[var(--color-text-primary)]">Required to complete module</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" loading={isPending} className="flex-1 rounded-xl shadow-lg shadow-[var(--color-primary)]/20">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
