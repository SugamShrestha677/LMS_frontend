'use client';

import { useState, useMemo } from 'react';
import { useCourses, useCreateCourse, useUpdateCourse, useCategories } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { 
  BookOpen, Plus, Search, Edit2, PlayCircle, Clock, 
  UploadCloud, FolderOpen, Eye, MoreHorizontal, 
  Users, BarChart3, Trash2, Copy, ExternalLink, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { useAuthStore } from '@/lib/store/authStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ImageUpload } from '@/components/ui/ImageUpload';

export default function TutorCoursesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const { data: courses, isLoading: isLoadingCourses } = useCourses();
  const { data: categoriesData } = useCategories();
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();


  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewVideoFile, setPreviewVideoFile] = useState<File | null>(null);

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

  const courseList = useMemo(() => {
    return Array.isArray(courses) 
      ? courses 
      : (courses as any)?.results || (courses as any)?.data || [];
  }, [courses]);

  const categories = useMemo(() => {
    const list = Array.isArray(categoriesData) 
      ? categoriesData 
      : (categoriesData as any)?.results || (categoriesData as any)?.data || [];
    return list.map((c: any) => ({
      value: c.id,
      label: c.name
    }));
  }, [categoriesData]);

  const filteredCourses = courseList.filter((c: any) => 
    (c.title || c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category_name || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatus = (course: any) => {
    return course.status || (course.is_published ? 'published' : course.is_active ? 'active' : 'draft');
  };

  const normalizeCourseStatus = (status?: string) => {
    return status === 'active' ? 'published' : (status || 'draft');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'primary';
      case 'active': return 'success';
      case 'draft': return 'secondary';
      case 'archived': return 'danger';
      default: return 'secondary';
    }
  };



  const onUpdate = (data: any) => {
    if (!selectedCourse) return;

    const status = normalizeCourseStatus(data.status);
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description || selectedCourse.description || selectedCourse.short_description || '');
    formData.append('short_description', data.short_description || selectedCourse.short_description || '');
    if (data.category) formData.append('category', String(parseInt(data.category)));
    formData.append('status', status);
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

    updateCourse({ id: selectedCourse.id, data: formData }, {
      onSuccess: () => {
        setIsEditModalOpen(false);
        setSelectedCourse(null);
      }
    });
  };

  const openEditModal = (course: any) => {
    setSelectedCourse(course);
    setValue('title', course.title || course.name || '');
    setValue('description', course.description || course.short_description || '');
    setValue('short_description', course.short_description || '');
    setValue('category', course.category || '');
    setValue('status', normalizeCourseStatus(getStatus(course)) as any);
    setValue('level', course.level || 'beginner');
    setValue('duration_weeks', course.duration_weeks || 4);
    setValue('total_hours', course.total_hours || 20);
    setValue('is_free', course.is_free !== false);
    setValue('price', course.price || 0);
    setValue('prerequisites', course.prerequisites || '');
    setValue('target_audience', course.target_audience || '');
    setValue('thumbnail_file', course.thumbnail_url || course.thumbnail || null);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            My <span className="text-[var(--color-primary)]">Courses</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Manage your course content and track student enrollments.
          </p>
        </div>

      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6 bg-[var(--color-bg-card)]/60 border-[var(--color-border)]">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Active Courses</p>
            <p className="text-2xl font-black text-[var(--color-text-primary)]">{courseList.length}</p>
          </div>
        </Card>
        <div className="md:col-span-2 relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search your courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full min-h-[72px] bg-[var(--color-bg-card)]/60 border border-[var(--color-border)] rounded-[2rem] pl-14 pr-6 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 transition-all font-medium text-[var(--color-text-primary)] backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingCourses ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4" />
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-20" />
                <div className="h-8 bg-gray-200 rounded w-20" />
              </div>
            </Card>
          ))
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-20 text-center">
              <BookOpen size={64} className="text-[var(--color-text-secondary)] mx-auto mb-4 opacity-30" />
              <p className="text-[var(--color-text-secondary)] font-medium text-lg mb-4">No courses found</p>

            </Card>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredCourses.map((course: any, idx: number) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                layout
              >
                <Card className="p-6 h-full flex flex-col hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                  onClick={() => router.push(`/tutor/courses/${course.id}`)}
                >
                  {/* Thumbnail */}
                  <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 h-40">
                    {course.thumbnail_url || course.thumbnail ? (
                      <img src={course.thumbnail_url || course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen size={48} className="text-[var(--color-primary)]/30" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant={getStatusColor(getStatus(course))} className="uppercase text-xs shadow-lg">
                        {getStatus(course)}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
                      {course.short_description || course.description || 'No description'}
                    </p>

                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)] mb-4">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {course.duration_weeks || 4}w
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={12} /> {course.enrolled_count || 0} students
                      </span>
                      {course.category_name && (
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} /> {course.category_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-4 border-t border-[var(--color-border)]">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tutor/courses/${course.id}`);
                      }}
                    >
                      <Eye size={14} className="mr-1" /> View
                    </Button>
                    {course.course_type !== 'live' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tutor/courses/${course.id}/modules`);
                        }}
                      >
                        <FolderOpen size={14} className="mr-1" /> Modules
                      </Button>
                    )}
                    {course.course_type === 'live' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/tutor/courses/${course.id}/live-sessions`);
                        }}
                      >
                        <Radio size={14} className="mr-1" /> Live
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tutor/courses/${course.id}/edit`);
                      }}
                    >
                      <Edit2 size={14} />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>




    </div>
  );
}
