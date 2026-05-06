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
import { BookOpen, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function AdminCoursesPage() {
  const { data: courses, isLoading: isLoadingCourses } = useCourses();
  const { data: categoriesData } = useCategories();
  const { data: users, isLoading: isLoadingUsers } = useUsers();
  const { mutate: createCourse, isPending: isCreating } = useCreateCourse();
  const { mutate: updateCourse, isPending: isUpdating } = useUpdateCourse();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      is_free: true,
      price: 0
    }
  });

  const isFree = watch('is_free');

  const tutors = useMemo(() => {
    const userList = Array.isArray(users) ? users : (users as any)?.data || [];
    return userList
      .filter((u: any) => u.role === 'tutor')
      .map((u: any) => ({
        value: u.id,
        label: u.first_name ? `${u.first_name} ${u.last_name || ''}` : u.email
      }));
  }, [users]);

  const courseList = useMemo(() => {
    return Array.isArray(courses) ? courses : (courses as any)?.data || [];
  }, [courses]);

  const categories = useMemo(() => {
    const list = Array.isArray(categoriesData) ? categoriesData : (categoriesData as any)?.data || [];
    return list.map((c: any) => ({
      value: c.id,
      label: c.name
    }));
  }, [categoriesData]);

  const filteredCourses = courseList.filter((c: any) => 
    (c.title || c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.category || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInstructorName = (course: any) => {
    // Priority: instructor_name > expanded instructor object > ID lookup in users
    if (course.instructor_name) return course.instructor_name;
    
    if (course.instructor && typeof course.instructor === 'object') {
      return `${course.instructor.first_name || ''} ${course.instructor.last_name || ''}`.trim() || course.instructor.email || 'Instructor';
    }

    const instructorId = course.instructor_id || course.instructor || course.tutor || course.tutor_id;
    if (instructorId) {
      const tutor = tutors.find(t => t.value === instructorId || t.value === parseInt(instructorId));
      return tutor ? tutor.label : `ID: ${instructorId}`;
    }

    return 'Unassigned';
  };

  const getStatus = (course: any) => {
    return course.status || (course.is_published ? 'published' : course.is_active ? 'active' : 'draft');
  };

  const onSubmit = (data: any) => {
    const payload = {
      title: data.title,
      description: data.description || data.title,
      short_description: data.description || data.title,
      instructor: data.instructor ? parseInt(data.instructor) : null,
      category: data.category ? parseInt(data.category) : null,
      status: data.status,
      is_free: data.is_free,
      price: data.is_free ? 0 : parseFloat(data.price || 0),
    };
    
    createCourse(payload, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const onUpdate = (data: any) => {
    if (!selectedCourse) return;
    
    const payload = {
      title: data.title,
      description: data.description || selectedCourse.description || selectedCourse.short_description || '',
      short_description: data.description || selectedCourse.short_description || '',
      instructor: data.instructor ? parseInt(data.instructor) : null,
      category: data.category ? parseInt(data.category) : null,
      status: data.status,
      is_free: data.is_free,
      price: data.is_free ? 0 : parseFloat(data.price || 0),
    };

    updateCourse({ id: selectedCourse.id, data: payload }, {
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
    setValue('category', course.category || '');
    
    const instructorId = typeof course.instructor === 'object' ? course.instructor?.id : (course.instructor || course.instructor_id || course.tutor);
    setValue('instructor', instructorId || '');
    setValue('status', getStatus(course));
    setValue('is_free', course.is_free !== false);
    setValue('price', course.price || 0);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Course <span className="text-[var(--color-primary)]">Catalog</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Manage educational content and instructor assignments.
          </p>
        </div>
        <Button 
          onClick={() => {
            reset();
            setIsModalOpen(true);
          }}
          size="lg" 
          className="rounded-2xl shadow-xl shadow-[var(--color-primary)]/20"
        >
          <Plus size={20} className="mr-2" /> Create New Course
        </Button>
      </div>

      {/* Stats and Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6 bg-[var(--color-bg-card)]/60 border-[var(--color-border)]">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Total Courses</p>
            <p className="text-2xl font-black text-[var(--color-text-primary)]">{courseList.length}</p>
          </div>
        </Card>
        <div className="md:col-span-2 relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full min-h-[72px] bg-[var(--color-bg-card)]/60 border border-[var(--color-border)] rounded-[2rem] pl-14 pr-6 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 transition-all font-medium text-[var(--color-text-primary)] backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Course Table */}
      <Card padding="none" className="overflow-hidden border-none shadow-2xl bg-[var(--color-bg-card)]/60 backdrop-blur-xl rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary)]/5">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Course Details</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Category</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Instructor</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoadingCourses ? (
                <tr><td colSpan={5} className="p-0"><TableSkeleton rows={5} /></td></tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-[var(--color-text-secondary)] font-medium">No courses found in the system.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course: any, idx: number) => (
                    <motion.tr 
                      key={course.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[var(--color-primary)]/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{course.title || course.name}</span>
                          <span className="text-[10px] text-[var(--color-text-secondary)] font-medium line-clamp-1 max-w-xs">
                            {course.short_description || course.description || 'No description provided.'}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="outline" className="font-bold border-[var(--color-border)] text-[var(--color-text-primary)]">
                          {course.category_name || course.category || 'Uncategorized'}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 font-bold text-[var(--color-text-primary)] text-sm">
                        {getInstructorName(course)}
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant={getStatus(course) === 'published' || getStatus(course) === 'active' ? 'primary' : 'secondary'} className="uppercase text-[10px] tracking-widest">
                          {getStatus(course)}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openEditModal(course)}
                            className="w-10 h-10 rounded-xl hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center hover:scale-110"
                            title="Edit Course"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button className="w-10 h-10 rounded-xl hover:bg-red-500/10 text-[var(--color-text-secondary)] hover:text-red-500 transition-all flex items-center justify-center hover:scale-110">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Create Course Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Course">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
          <Input label="Course Title" placeholder="e.g. Full Stack Development" {...register('title', { required: true })} />
          <Input label="Description" placeholder="Brief overview of the course content..." {...register('description')} />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Category" 
              options={categories} 
              {...register('category')} 
            />
            <Select 
              label="Instructor" 
              options={tutors} 
              {...register('instructor')} 
            />
          </div>
          <Select 
            label="Initial Status" 
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'published', label: 'Published' },
            ]} 
            {...register('status')} 
          />
          <div className="flex items-center gap-2 px-1">
            <input 
              type="checkbox" 
              id="is_free" 
              {...register('is_free')}
              className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="is_free" className="text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer">
              This course is free
            </label>
          </div>
          {!isFree && (
            <Input 
              label="Course Price ($)" 
              type="number" 
              step="0.01" 
              min="0"
              placeholder="e.g. 49.99" 
              {...register('price', { required: !isFree })} 
            />
          )}
          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" loading={isCreating} className="flex-1 rounded-xl">Create Course</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Course Modal */}
      <Modal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Update Course Details">
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-6 pt-4">
          <Input label="Course Title" {...register('title', { required: true })} />
          <Input label="Description" {...register('description')} />
          <div className="grid grid-cols-2 gap-4">
            <Select 
              label="Category" 
              options={categories} 
              {...register('category')} 
            />
            <Select 
              label="Instructor" 
              options={tutors} 
              {...register('instructor')} 
            />
          </div>
          <Select 
            label="Course Status" 
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'active', label: 'Active' },
              { value: 'published', label: 'Published' },
            ]} 
            {...register('status')} 
          />
          <div className="flex items-center gap-2 px-1">
            <input 
              type="checkbox" 
              id="edit_is_free" 
              {...register('is_free')}
              className="w-4 h-4 text-[var(--color-primary)] rounded border-gray-300 focus:ring-[var(--color-primary)]"
            />
            <label htmlFor="edit_is_free" className="text-sm font-semibold text-[var(--color-text-primary)] cursor-pointer">
              This course is free
            </label>
          </div>
          {!isFree && (
            <Input 
              label="Course Price ($)" 
              type="number" 
              step="0.01" 
              min="0"
              {...register('price', { required: !isFree })} 
            />
          )}
          <div className="pt-4 flex gap-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)} className="flex-1 rounded-xl">Cancel</Button>
            <Button type="submit" loading={isUpdating} className="flex-1 rounded-xl">Save Changes</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
