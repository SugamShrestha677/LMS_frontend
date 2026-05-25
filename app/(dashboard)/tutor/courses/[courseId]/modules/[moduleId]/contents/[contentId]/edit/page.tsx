'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { useUpdateModuleContent, useModuleContents } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import { courseService } from '@/lib/services/course.service';
import { toast } from 'react-hot-toast';

const contentTypes = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'mp4', label: 'MP4 Video' },
  { value: 'mp3', label: 'MP3 Audio' },
];

interface ContentFormData {
  title: string;
  content_type: string;
  description: string;
  file_url: string;
  video_url: string;
  audio_url: string;
  external_link: string;
  body_text: string;
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
  
  const { data: contentsData, isLoading, refetch } = useModuleContents(courseId, moduleId);
  const { mutate: updateContent, isPending } = useUpdateModuleContent();
  const [selectedType, setSelectedType] = useState('pdf');
  const [uploading, setUploading] = useState(false);
  const [scormStatus, setScormStatus] = useState<any>(null);
  
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm<ContentFormData>();

  const currentItem = contentsData ? (Array.isArray(contentsData) ? contentsData : (contentsData as any)?.results || (contentsData as any)?.data || []).find((c: any) => c.id === contentId) : null;

  useEffect(() => {
    if (currentItem) {
      reset({
        title: currentItem.title,
        content_type: currentItem.content_type,
        description: currentItem.description || '',
        file_url: currentItem.file_url || '',
        video_url: currentItem.video_url || '',
        audio_url: currentItem.audio_url || '',
        external_link: currentItem.external_link || '',
        body_text: currentItem.body_text || '',
        duration_minutes: currentItem.duration_minutes,
        is_required: currentItem.is_required,
        minimum_score: currentItem.minimum_score || 0,
      });
      setSelectedType(currentItem.content_type);
      setScormStatus(currentItem.scorm_status);
    }
  }, [currentItem, reset]);

  // Polling for SCORM status
  useEffect(() => {
    let interval: any;
    if (currentItem?.scorm_status === 'processing' || scormStatus === 'processing') {
      interval = setInterval(async () => {
        try {
          const response = await courseService.getContentScormStatus(courseId, moduleId, contentId);
          if (response.success) {
            const status = response.data.status.toLowerCase();
            setScormStatus(status);
            if (status === 'finished' || status === 'complete' || status === 'error') {
              clearInterval(interval);
              refetch();
            }
          }
        } catch (error) {
          console.error('Failed to fetch SCORM status:', error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [currentItem, scormStatus, courseId, moduleId, contentId, refetch]);

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await courseService.uploadContentScorm(courseId, moduleId, contentId, formData);
      if (response.success) {
        toast.success('Upload started. Processing content...');
        setScormStatus('processing');
        refetch();
      } else {
        toast.error(response.message || 'Upload failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = (data: ContentFormData) => {
    // Exclude content_type and order_number from the PATCH payload.
    // Sending order_number causes a DB unique-constraint error if another
    // item already holds that (module_id, order_number) combination.
    const { content_type, ...rest } = data;
    const updatePayload = { ...rest };

    updateContent(
      { courseId, moduleId, contentId, data: updatePayload },
      {
        onSuccess: () => {
          toast.success('Content updated successfully');
          router.push(`/tutor/courses/${courseId}/modules/${moduleId}/contents`);
        },
      }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Edit Content</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Update learning material and SCORM Cloud hosting</p>
        </div>
        {currentItem?.scorm_status && (
          <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider ${
            currentItem.scorm_status === 'finished' ? 'bg-green-100 text-green-700' :
            currentItem.scorm_status === 'processing' ? 'bg-blue-100 text-blue-700 animate-pulse' :
            currentItem.scorm_status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
          }`}>
            SCORM Cloud: {currentItem.scorm_status}
          </div>
        )}
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

          {/* SCORM Cloud Upload Section */}
          <div className="p-6 bg-[var(--color-primary)]/5 rounded-[1.5rem] border border-[var(--color-primary)]/10 border-dashed">
            <h3 className="text-sm font-bold text-[var(--color-primary)] mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              SCORM Cloud Hosting
            </h3>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">
              Host your {selectedType.toUpperCase()} on SCORM Cloud for secure delivery and tracking.
            </p>
            
            <div className="flex items-center gap-4">
              <label className={`relative flex-1 cursor-pointer group ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center justify-center w-full py-4 px-4 bg-white border-2 border-dashed border-[var(--color-border)] group-hover:border-[var(--color-primary)] rounded-xl transition-all">
                  <div className="flex flex-center gap-3">
                    {uploading ? (
                      <div className="w-5 h-5 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-5 h-5 text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    )}
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                      {uploading ? 'Uploading...' : `Upload ${selectedType.toUpperCase()} to SCORM Cloud`}
                    </span>
                  </div>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept={selectedType === 'pdf' ? '.pdf' : selectedType === 'mp4' ? '.mp4' : '.mp3'}
                  onChange={onFileUpload}
                />
              </label>
            </div>
            {currentItem?.scorm_version > 1 && (
              <p className="mt-2 text-[10px] font-bold text-[var(--color-primary)] text-right">
                Current Version: {currentItem.scorm_version}
              </p>
            )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Order # is shown read-only; changing it here causes a unique-constraint
                DB error. Use a dedicated reorder UI instead. */}
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-[var(--color-text-primary)]">Order Number</label>
              <div className="px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] text-sm">
                #{currentItem?.order_number ?? '—'} <span className="text-xs">(read‑only)</span>
              </div>
            </div>
            <Input
              label="Duration (min)"
              type="number"
              {...register('duration_minutes', { valueAsNumber: true })}
            />
            {currentItem?.minimum_score !== undefined && (
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
