'use client';

import { useParams, useRouter } from 'next/navigation';
import { useModuleContents, useDeleteModuleContent } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, Video, FileText, Link, File, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const contentIcons: Record<string, any> = {
  video: Video,
  pdf: File,
  text: FileText,
  quiz: HelpCircle,
  assignment: FileText,
  link: Link,
};

export default function ModuleContentsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  const moduleId = Number(params.moduleId);
  
  const { data: contentsData, isLoading } = useModuleContents(courseId, moduleId);
  const { mutate: deleteContent } = useDeleteModuleContent();

  const contents = Array.isArray(contentsData) ? contentsData : (contentsData as any)?.results || (contentsData as any)?.data || [];

  const handleDelete = (contentId: number, title: string) => {
    if (confirm(`Delete "${title}"?`)) {
      deleteContent({ courseId, moduleId, contentId });
    }
  };

  const getContentIcon = (type: string) => {
    const Icon = contentIcons[type] || FileText;
    return <Icon size={18} />;
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Module Contents</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage videos, documents, quizzes and more</p>
        </div>
        <Button onClick={() => router.push(`/tutor/courses/${courseId}/modules/${moduleId}/contents/create`)}>
          <Plus size={18} className="mr-2" /> Add Content
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin mx-auto" />
        </Card>
      ) : contents.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-[var(--color-text-secondary)]">No content items yet</p>
          <Button onClick={() => router.push(`/tutor/courses/${courseId}/modules/${moduleId}/contents/create`)} className="mt-4">
            Add First Content
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {contents.map((content: any, idx: number) => (
              <motion.div
                key={content.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.03 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        {getContentIcon(content.content_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm">{content.title}</span>
                          <Badge variant="outline" className="text-xs capitalize">{content.content_type}</Badge>
                          {content.is_required && <Badge variant="primary" className="text-xs">Required</Badge>}
                        </div>
                        <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                          Order: {content.order_number} • {content.duration_minutes} min
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => router.push(`/tutor/courses/${courseId}/modules/${moduleId}/contents/${content.id}/edit`)}>
                        <Edit2 size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(content.id, content.title)} className="text-red-500 hover:bg-red-50">
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