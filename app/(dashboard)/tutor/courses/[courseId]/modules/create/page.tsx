'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateModule, useModules } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface ModuleFormData {
  title: string;
  description: string;
  order_number: number;
  duration_minutes: number;
  is_published: boolean;
}

export default function CreateModulePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { data: modulesData } = useModules(courseId);
  const existingModules = Array.isArray(modulesData) ? modulesData : (modulesData as any)?.data || [];
  const nextOrder = existingModules.length + 1;
  
  const { mutate: createModule, isPending } = useCreateModule();
  
  const { register, handleSubmit, formState: { errors } } = useForm<ModuleFormData>({
    defaultValues: {
      order_number: nextOrder,
      duration_minutes: 30,
      is_published: false,
    }
  });

  const onSubmit = (data: ModuleFormData) => {
    createModule(
      { courseId, data },
      { onSuccess: () => router.push(`/tutor/courses/${courseId}/modules`) }
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Create Module</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Add a new module to your course</p>
      </div>

      <Card className="p-8 max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Module Title"
            placeholder="e.g., Introduction to Python"
            {...register('title', { required: 'Title is required' })}
            error={errors.title?.message}
          />
          
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-[#1E1E2A]">Description</label>
            <textarea
              {...register('description')}
              rows={4}
              placeholder="Module description..."
              className="w-full px-4 py-3 rounded-lg border border-[#e5e7eb] bg-white focus:outline-none focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] transition-all"
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

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('is_published')}
              className="w-4 h-4 rounded border-gray-300 text-[#0A5C4A] focus:ring-[#0A5C4A]"
            />
            <span className="text-sm font-medium">Publish immediately</span>
          </label>

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending}>
              Create Module
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}