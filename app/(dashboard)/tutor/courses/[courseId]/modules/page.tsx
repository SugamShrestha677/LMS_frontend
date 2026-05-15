'use client';

import { useParams, useRouter } from 'next/navigation';
import { useModules, useDeleteModule, useCourse } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, ChevronRight, GripVertical, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function ModulesPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { data: courseData } = useCourse(courseId);
  const { data: modulesData, isLoading } = useModules(courseId);
  const { mutate: deleteModule, isPending: isDeleting } = useDeleteModule();

  const course = Array.isArray(courseData) ? courseData[0] : courseData;

  // Support multiple backend shapes:
  // - direct array: []
  // - paginated DRF: { count, results: [...] }
  // - wrapped api_success: { success, data: [...] }
  let modules: any[] = [];
  if (Array.isArray(modulesData)) {
    modules = modulesData;
  } else if ((modulesData as any)?.results && Array.isArray((modulesData as any).results)) {
    modules = (modulesData as any).results;
  } else if ((modulesData as any)?.data && Array.isArray((modulesData as any).data)) {
    modules = (modulesData as any).data;
  } else {
    modules = [];
  }
  // Debugging helper: log response shapes in browser console
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.log('useModules raw:', modulesData, 'resolvedModules:', modules);
  }

  const handleDelete = (moduleId: number, moduleTitle: string) => {
    if (confirm(`Delete module "${moduleTitle}"? This will also delete all its contents.`)) {
      deleteModule({ courseId, moduleId });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">
            {course?.title || 'Course'} - Modules
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Manage course modules and their order
          </p>
        </div>
        <Button onClick={() => router.push(`/tutor/courses/${courseId}/modules/create`)}>
          <Plus size={18} className="mr-2" /> Create Module
        </Button>
      </div>

      {/* Modules List */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin mx-auto" />
        </Card>
      ) : modules.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-[var(--color-text-secondary)]">No modules yet. Create your first module!</p>
          <Button onClick={() => router.push(`/tutor/courses/${courseId}/modules/create`)} className="mt-4">
            Create Module
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {modules.map((module: any, idx: number) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                        <span className="font-black text-[var(--color-primary)]">{module.order_number}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-[var(--color-text-primary)]">{module.title}</h3>
                          {module.is_published ? (
                            <Badge variant="primary" className="text-xs">Published</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Draft</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                          {module.description || 'No description'}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1"><Clock size={12} /> {module.duration_minutes} min</span>
                          <span>{module.content_count || 0} contents</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/tutor/courses/${courseId}/modules/${module.id}/contents`)}
                      >
                        Contents <ChevronRight size={16} className="ml-1" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/tutor/courses/${courseId}/modules/${module.id}/edit`)}
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        loading={isDeleting}
                        onClick={() => handleDelete(module.id, module.title)}
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}