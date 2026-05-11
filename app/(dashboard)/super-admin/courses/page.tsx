'use client';

import { useState, useMemo } from 'react';
import { useCourses, useCreateCourse, useUpdateCourse, useCategories } from '@/lib/hooks/useCourses';
import { useUsers } from '@/lib/hooks/useAdmin';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { BookOpen, Plus, Search, Edit2, Trash2, Users, Star, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { cn } from '@/lib/utils';

type CourseFormValues = {
  title: string;
  description: string;
  category: string;
  instructor: string;
  course_type: 'self_paced' | 'live';
  status: 'draft' | 'active' | 'published';
  is_free: boolean;
  price: number | string;
  max_students: number | string;
  thumbnail_file: File | string | null;
};

export default function SuperAdminCoursesPage() {
  const { data: coursesData, isLoading: isLoadingCourses } = useCourses();
  const { data: categoriesData } = useCategories();
  const { data: usersData, isLoading: isLoadingUsers } = useUsers();
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, setValue, watch, control } = useForm<CourseFormValues>({
    defaultValues: {
      title: '',
      description: '',
      category: '',
      instructor: '',
      course_type: 'self_paced',
      status: 'draft',
      is_free: true,
      price: 0,
      max_students: 50,
      thumbnail_file: null
    }
  });

  const isFree = watch('is_free');

  const tutors = useMemo(() => {
    const userList = Array.isArray(usersData) ? usersData : (usersData as any)?.data || [];
    return userList
      .filter((u: any) => u.role === 'tutor')
      .map((u: any) => ({
        value: u.id,
        label: u.first_name ? `${u.first_name} ${u.last_name || ''}` : u.email
      }));
  }, [usersData]);

  const courses = useMemo(() => {
    return Array.isArray(coursesData) ? coursesData : (coursesData as any)?.data || [];
  }, [coursesData]);

  const categories = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.data || [];
    return list.map((c: any) => ({
      value: c.id,
      label: c.name
    }));
  }, [categoriesData]);

  const filteredCourses = courses.filter((c: any) => 
    (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || data.title);
    formData.append('short_description', data.description || data.title);
    formData.append('course_type', data.course_type);
    if (data.instructor) formData.append('instructor', String(data.instructor));
    if (data.category) formData.append('category', String(data.category));
    formData.append('status', data.status);
    formData.append('is_free', String(data.is_free));
    formData.append('price', String(data.is_free ? 0 : parseFloat(data.price || 0)));
    formData.append('max_students', String(data.max_students || 50));
    
    if (data.thumbnail_file) {
      formData.append('thumbnail_file', data.thumbnail_file);
    }
    
    createCourse(formData, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const onUpdate = (data: any) => {
    if (!selectedCourse) return;
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || selectedCourse.description || '');
    formData.append('course_type', data.course_type);
    if (data.instructor) formData.append('instructor', String(data.instructor));
    if (data.category) formData.append('category', String(data.category));
    formData.append('status', data.status);
    formData.append('is_free', String(data.is_free));
    formData.append('price', String(data.is_free ? 0 : parseFloat(data.price || 0)));
    formData.append('max_students', String(data.max_students || 50));

    if (data.thumbnail_file instanceof File) {
      formData.append('thumbnail_file', data.thumbnail_file);
    }

    updateCourse({ id: selectedCourse.id, data: formData }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedCourse(null);
      }
    });
  };

  const openEditModal = (course: any) => {
    setSelectedCourse(course);
    setValue('title', course.title || '');
    setValue('description', course.description || course.short_description || '');
    setValue('category', course.category || '');
    setValue('course_type', course.course_type || 'self_paced');
    setValue('instructor', course.instructor || '');
    setValue('status', course.status || 'draft');
    setValue('is_free', course.is_free !== false);
    setValue('price', course.price || 0);
    setValue('max_students', course.max_students || 50);
    setValue('thumbnail_file', course.thumbnail_url || course.thumbnail || null);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)] p-8 rounded-[2rem] border-2 border-[var(--color-border)] shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-bl-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-[var(--color-text-primary)] tracking-tight uppercase">
            Platform <span className="text-[var(--color-primary)]">Courses</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-bold flex items-center gap-2">
            <span className="w-8 h-1 bg-[var(--color-primary)] rounded-full" />
            Curriculum management and enrollment tracking
          </p>
        </div>
        <Button 
          onClick={() => { reset(); setIsModalOpen(true); }}
          className="rounded-2xl h-14 px-8 shadow-2xl shadow-[var(--color-primary)]/30 font-black uppercase tracking-widest text-[10px] relative z-10"
        >
          <Plus size={18} className="mr-2" /> Create Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Courses', value: courses.length, icon: BookOpen },
          { label: 'Published', value: courses.filter((c: any) => c.status === 'published').count || 0, icon: Star },
          { label: 'Total Students', value: courses.reduce((acc: number, c: any) => acc + (c.enrolled_count || 0), 0), icon: Users },
          { label: 'Active Drafts', value: courses.filter((c: any) => c.status === 'draft').length, icon: Edit2 },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-[var(--color-bg-card)] border-2 border-[var(--color-border)] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black text-[var(--color-text-primary)]">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden border-2 border-[var(--color-border)] shadow-2xl bg-[var(--color-bg-card)]/80 backdrop-blur-xl rounded-[2.5rem]">
        <div className="p-6 border-b-2 border-[var(--color-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <input
              type="text"
              placeholder="Search platform courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-muted)]/30 border-2 border-[var(--color-border)] rounded-2xl text-sm font-bold focus:border-[var(--color-primary)] outline-none transition-all text-[var(--color-text-primary)]"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30 border-b-2 border-[var(--color-border)]">
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Course Details</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Instructor</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Enrollment</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[var(--color-border)]">
              {isLoadingCourses ? (
                <tr><td colSpan={5} className="p-0"><TableSkeleton rows={5} /></td></tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-[var(--color-text-secondary)] font-bold uppercase text-xs tracking-widest">
                    No courses found in system architecture.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course: any) => (
                  <tr key={course.id} className="hover:bg-[var(--color-primary)]/[0.02] transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] shadow-inner">
                          <BookOpen size={22} />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{course.title}</span>
                          <span className="text-[10px] text-[var(--color-text-secondary)] font-bold uppercase tracking-tight">{course.category_name || 'Uncategorized'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-[var(--color-text-secondary)] font-black uppercase">
                      {course.instructor_name || 'Unassigned'}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] font-black">
                        <Users size={16} className="text-[var(--color-primary)]" /> {(course.enrolled_count || 0).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <Badge variant={course.status === 'published' ? 'primary' : 'secondary'} className="uppercase text-[9px] tracking-[0.2em] px-3 py-1">
                        {course.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(course)}
                          className="p-2.5 bg-[var(--color-muted)] hover:bg-[var(--color-primary)] hover:text-white rounded-xl transition-all shadow-sm"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2.5 bg-[var(--color-muted)] hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-sm">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Course Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initialize New Course">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4 max-h-[80vh] overflow-y-auto px-1 scrollbar-hide">
          <Controller
            name="thumbnail_file"
            control={control}
            render={({ field }) => (
              <ImageUpload label="Course Visual Identity" value={field.value} onChange={field.onChange} />
            )}
          />
          <Input label="Platform Title" placeholder="e.g. Quantum Computing Essentials" {...register('title', { required: true })} className="rounded-2xl border-2" />
          <Input label="Description Architecture" placeholder="Outline the learning path..." {...register('description')} className="rounded-2xl border-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Knowledge Domain" options={categories} {...register('category')} className="rounded-2xl border-2" />
            <Select label="Designated Faculty" options={tutors} {...register('instructor')} className="rounded-2xl border-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Deployment Type" options={[{ value: 'self_paced', label: 'Self-Paced' }, { value: 'live', label: 'Live' }]} {...register('course_type')} className="rounded-2xl border-2" />
            <Select label="Initial Status" options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} {...register('status')} className="rounded-2xl border-2" />
          </div>

          <div className="pt-6 flex gap-4 sticky bottom-0 bg-[var(--color-bg-card)] pb-2">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-2xl h-14 font-black uppercase text-[10px]">Cancel</Button>
            <Button type="submit" loading={isCreating} className="flex-1 rounded-2xl h-14 shadow-2xl shadow-[var(--color-primary)]/20 font-black uppercase text-[10px]">Deploy Course</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Modify Course Configuration">
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-6 pt-4 max-h-[80vh] overflow-y-auto px-1 scrollbar-hide">
          <Controller
            name="thumbnail_file"
            control={control}
            render={({ field }) => (
              <ImageUpload label="Course Visual Identity" value={field.value} onChange={field.onChange} />
            )}
          />
          <Input label="Platform Title" {...register('title', { required: true })} className="rounded-2xl border-2" />
          <Input label="Description Architecture" {...register('description')} className="rounded-2xl border-2" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Knowledge Domain" options={categories} {...register('category')} className="rounded-2xl border-2" />
            <Select label="Designated Faculty" options={tutors} {...register('instructor')} className="rounded-2xl border-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Deployment Type" options={[{ value: 'self_paced', label: 'Self-Paced' }, { value: 'live', label: 'Live' }]} {...register('course_type')} className="rounded-2xl border-2" />
            <Select label="Course Status" options={[{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }]} {...register('status')} className="rounded-2xl border-2" />
          </div>

          <div className="pt-6 flex gap-4 sticky bottom-0 bg-[var(--color-bg-card)] pb-2">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-2xl h-14 font-black uppercase text-[10px]">Cancel</Button>
            <Button type="submit" loading={isUpdating} className="flex-1 rounded-2xl h-14 shadow-2xl shadow-[var(--color-primary)]/20 font-black uppercase text-[10px]">Save Configuration</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
