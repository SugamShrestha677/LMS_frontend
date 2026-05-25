'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useCreateModuleContent, useModuleContents } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { courseService } from '@/lib/services/course.service';
import { toast } from 'react-hot-toast';

const contentTypes = [
  { value: 'video', label: 'Video' },
  { value: 'pdf', label: 'PDF Document' },
  { value: 'text', label: 'Text/Article' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'link', label: 'External Link' },
  { value: 'scorm', label: 'SCORM Package' },
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

export default function CreateContentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const moduleId = Number(params.moduleId);
  
  const { data: contentsData } = useModuleContents(courseId, moduleId);
  const existingContents = Array.isArray(contentsData) ? contentsData : (contentsData as any)?.results || (contentsData as any)?.data || [];
  const nextOrder = existingContents.length + 1;
  
  const { mutate: createContent, isPending } = useCreateModuleContent();
  const [selectedType, setSelectedType] = useState('video');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingScorm, setIsUploadingScorm] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ContentFormData>({
    defaultValues: {
      content_type: 'video',
      order_number: nextOrder,
      duration_minutes: 15,
      is_required: true,
      minimum_score: 0,
    }
  });

  const onSubmit = (data: ContentFormData) => {
    if (selectedType === 'scorm' && !selectedFile) {
      toast.error('Please select a SCORM zip file');
      return;
    }

    createContent(
      { courseId, moduleId, data },
      { 
        onSuccess: async (res: any) => {
          if (selectedType === 'scorm' && selectedFile) {
            const newContentId = res?.id || res?.data?.id;
            if (newContentId) {
              setIsUploadingScorm(true);
              try {
                const formData = new FormData();
                formData.append('file', selectedFile);
                await courseService.uploadContentScorm(courseId, moduleId, newContentId, formData);
                toast.success('SCORM package uploaded successfully');
              } catch (error) {
                toast.error('Failed to upload SCORM file');
              } finally {
                setIsUploadingScorm(false);
                router.push(`/tutor/courses/${courseId}/modules/${moduleId}/contents`);
              }
              return;
            }
          }
          router.push(`/tutor/courses/${courseId}/modules/${moduleId}/contents`);
        } 
      }
    );
  };

  const showDuration = !['pdf', 'link'].includes(selectedType);

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Add Content</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Add learning material to this module</p>
      </div>

      <Card className="p-8 max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Content Title"
            placeholder="e.g., Python Installation Tutorial"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />

          {/* Content Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-[#1E1E2A] mb-2">Content Type</label>
            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map((type) => (
                <label
                  key={type.value}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedType === type.value
                      ? 'border-[#0A5C4A] bg-[#0A5C4A]/5 text-[#0A5C4A]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('content_type')}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1E1E2A]">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Brief description..."
              className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] transition-all"
            />
          </div>

          {/* Type-specific fields */}
          {selectedType === 'video' && (
            <Input
              label="Video URL"
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
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

          {selectedType === 'scorm' && (
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#1E1E2A]">SCORM ZIP Package</label>
              <input
                type="file"
                accept=".zip"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFile(e.target.files[0]);
                  } else {
                    setSelectedFile(null);
                  }
                }}
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0A5C4A]/10 file:text-[#0A5C4A] hover:file:bg-[#0A5C4A]/20 cursor-pointer"
              />
            </div>
          )}

          {selectedType === 'text' && (
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[#1E1E2A]">Text Content</label>
              <textarea
                {...register('body_text')}
                rows={8}
                placeholder="Write your content here..."
                className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] transition-all font-mono text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Order Number"
              type="number"
              {...register('order_number', { valueAsNumber: true, required: true })}
            />
            {showDuration && (
              <Input
                label="Duration (min)"
                type="number"
                {...register('duration_minutes', { valueAsNumber: true })}
              />
            )}
            {(selectedType === 'quiz' || selectedType === 'assignment') && (
              <Input
                label="Min Score (%)"
                type="number"
                {...register('minimum_score', { valueAsNumber: true })}
              />
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_required')}
              className="w-4 h-4 rounded border-gray-300 text-[#0A5C4A] focus:ring-[#0A5C4A]"
            />
            <span className="text-sm font-medium">Required to complete module</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending || isUploadingScorm}>
              {isUploadingScorm ? 'Uploading SCORM...' : 'Add Content'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}