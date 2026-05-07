'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useUpdateModule, useModules } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useEffect } from 'react';

interface ModuleFormData {
  title: string;
  description: string;
  order_number: number;
  duration_minutes: number;
  is_published: boolean;
}

export default function EditModulePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const moduleId = Number(params.moduleId);
  
  const { data: modulesData, isLoading } = useModules(courseId);
  const { mutate: updateModule, isPending } = useUpdateModule();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ModuleFormData>();

  useEffect(() => {
    if (modulesData) {
      const modules = Array.isArray(modulesData) ? modulesData : (modulesData as any)?.data || [];
      const moduleToEdit = modules.find((m: any) => m.id === moduleId);
      if (moduleToEdit) {
        reset({
          title: moduleToEdit.title,
          description: moduleToEdit.description || '',
          order_number: moduleToEdit.order_number,
          duration_minutes: moduleToEdit.duration_minutes,
          is_published: moduleToEdit.is_published,
        });
      }
    }
  }, [modulesData, moduleId, reset]);

  const onSubmit = (data: ModuleFormData) => {
    updateModule(
      { courseId, moduleId, data },
      { onSuccess: () => router.push(`/tutor/courses/${courseId}/modules`) }
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
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Edit Module</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Update module details and settings</p>
      </div>

      <Card className="p-8 max-w-2xl bg-[var(--color-bg-card)]/60 backdrop-blur-sm border-[var(--color-border)] rounded-[2rem]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Module Title"
            placeholder="e.g., Introduction to Python"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[var(--color-text-primary)]">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Module description..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Order Number"
              type="number"
              {...register('order_number', { valueAsNumber: true, required: true })}
              error={errors.order_number?.message}
            />
            <Input
              label="Duration (minutes)"
              type="number"
              {...register('duration_minutes', { valueAsNumber: true, required: true })}
              error={errors.duration_minutes?.message}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer p-1">
            <input
              type="checkbox"
              {...register('is_published')}
              className="w-5 h-5 rounded-lg border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-sm font-bold text-[var(--color-text-primary)]">Module is published</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" loading={isPending} className="flex-1 rounded-xl">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
