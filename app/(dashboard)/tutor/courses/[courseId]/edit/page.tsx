'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { useCourse, useUpdateCourse, useCategories } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';

export default function TutorCourseEditPage() {
  const { courseId: paramCourseId } = useParams();
  const router = useRouter();
  const courseId = parseInt(paramCourseId as string);

  const { data: course, isLoading: isLoadingCourse } = useCourse(courseId);
  const { data: categoriesData } = useCategories();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const categories = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.data || [];
    return list.map((c: any) => ({
      value: c.id,
      label: c.name
    }));
  }, [categoriesData]);

  const { register, handleSubmit, reset, setValue, watch, control } = useForm({
    defaultValues: {
      thumbnail_file: null,
      title: '',
      description: '',
      short_description: '',
      category: '',
      status: 'draft',
      level: 'beginner',
      duration_weeks: 4,
      total_hours: 20,
      is_free: true,
      price: 0,
      prerequisites: '',
      target_audience: '',
    }
  });

  const isFree = watch('is_free');

  useEffect(() => {
    if (course) {
      const getStatus = (c: any) => c.status || (c.is_published ? 'published' : c.is_active ? 'active' : 'draft');
      
      setValue('title', course.title || course.name || '');
      setValue('description', course.description || course.short_description || '');
      setValue('short_description', course.short_description || '');
      setValue('category', course.category || '');
      setValue('status', getStatus(course));
      setValue('level', course.level || 'beginner');
      setValue('duration_weeks', course.duration_weeks || 4);
      setValue('total_hours', course.total_hours || 20);
      setValue('is_free', course.is_free !== false);
      setValue('price', course.price || 0);
      setValue('prerequisites', course.prerequisites || '');
      setValue('target_audience', course.target_audience || '');
      setValue('thumbnail_file', course.thumbnail_url || course.thumbnail || null);
    }
  }, [course, setValue]);

  const onUpdate = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || course.description || course.short_description || '');
    formData.append('short_description', data.short_description || course.short_description || '');
    if (data.category) formData.append('category', String(parseInt(data.category)));
    formData.append('status', data.status);
    formData.append('level', data.level);
    formData.append('duration_weeks', String(data.duration_weeks));
    formData.append('total_hours', String(data.total_hours));
    formData.append('is_free', String(data.is_free));
    formData.append('price', String(data.is_free ? 0 : parseFloat(data.price || 0)));
    formData.append('prerequisites', data.prerequisites || '');
    formData.append('target_audience', data.target_audience || '');

    if (data.thumbnail_file instanceof File) {
      formData.append('thumbnail_file', data.thumbnail_file);
    }

    updateCourse({ id: courseId, data: formData }, {
      onSuccess: () => {
        router.push('/tutor/courses');
      }
    });
  };

  if (isLoadingCourse) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--color-primary)]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 pt-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2.5rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.push('/tutor/courses')}
            className="rounded-2xl w-12 h-12 flex items-center justify-center p-0"
          >
            <ArrowLeft size={24} />
          </Button>
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)]">
              Edit <span className="text-[var(--color-primary)]">Course</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] font-medium">Update your course content and settings.</p>
          </div>
        </div>
        <Button 
          onClick={handleSubmit(onUpdate)} 
          loading={isUpdating}
          size="lg"
          className="rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 px-8"
        >
          <Save size={20} className="mr-2" /> Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 space-y-8 bg-[var(--color-bg-card)]/60 backdrop-blur-sm border-[var(--color-border)] rounded-[2rem]">
            <div className="space-y-6">
              <Input 
                label="Course Title" 
                {...register('title', { required: true })} 
                disabled={true}
                helper="Course title can only be changed by administrators."
              />
              <Input label="Short Description" placeholder="One-line summary..." {...register('short_description')} />
              <div className="space-y-2">
                <label className="text-sm font-bold text-[var(--color-text-primary)] px-1">Full Description</label>
                <textarea 
                  {...register('description')}
                  className="w-full min-h-[200px] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-2xl p-5 focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all text-sm font-medium leading-relaxed"
                  placeholder="Tell students what they will learn..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Duration (Weeks)" type="number" {...register('duration_weeks')} />
              <Input label="Total Hours" type="number" {...register('total_hours')} />
            </div>

            <div className="space-y-6">
              <Input label="Prerequisites" placeholder="What should students know before starting?" {...register('prerequisites')} />
              <Input label="Target Audience" placeholder="Who is this course for?" {...register('target_audience')} />
            </div>
          </Card>
        </div>

        {/* Right Column - Media & Settings */}
        <div className="space-y-6">
          <Card className="p-8 space-y-8 bg-[var(--color-bg-card)]/60 backdrop-blur-sm border-[var(--color-border)] rounded-[2rem]">
            <Controller
              name="thumbnail_file"
              control={control}
              render={({ field }) => (
                <ImageUpload 
                  label="Course Thumbnail" 
                  value={field.value} 
                  onChange={field.onChange} 
                  disabled={true}
                />
              )}
            />

            <Select 
              label="Category" 
              options={categories} 
              {...register('category')} 
              disabled={true}
              helper="Category is fixed after creation."
            />

            <Select 
              label="Level" 
              options={[
                { value: 'beginner', label: 'Beginner' },
                { value: 'intermediate', label: 'Intermediate' },
                { value: 'advanced', label: 'Advanced' },
              ]} 
              {...register('level')} 
              disabled={true}
              helper="Course difficulty level is set by administrators."
            />

            <Select 
              label="Course Status" 
              options={[
                { value: 'draft', label: 'Draft' },
                { value: 'active', label: 'Active' },
                { value: 'published', label: 'Published' },
              ]} 
              {...register('status')} 
              disabled={true}
              helper="Status is managed by administrators."
            />
          </Card>

          <Card className="p-8 bg-[var(--color-primary)]/[0.03] border-[var(--color-primary)]/10 rounded-[2rem]">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <div className="space-y-1">
                  <label htmlFor="edit_is_free" className="text-sm font-bold text-[var(--color-text-primary)] cursor-pointer">
                    Is this course free?
                  </label>
                  <p className="text-[10px] text-[var(--color-text-secondary)] font-medium">Locked by administrator</p>
                </div>
                <input 
                  type="checkbox" 
                  id="edit_is_free" 
                  {...register('is_free')}
                  disabled={true}
                  className="w-6 h-6 text-[var(--color-primary)] rounded-lg border-gray-300 focus:ring-[var(--color-primary)] transition-all cursor-not-allowed opacity-60"
                />
              </div>
              {!isFree && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="pt-2"
                >
                  <Input 
                    label="Price (NPR)" 
                    type="number" 
                    step="0.01" 
                    min="0"
                    placeholder="0.00"
                    {...register('price', { required: !isFree })} 
                    disabled={true}
                    helper="Pricing can only be modified by administrators."
                  />
                </motion.div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
