'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  useCourse, useCourseResources, useCreateCourseResource, 
  useDeleteCourseResource, useModules 
} from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Download, ExternalLink, Trash2, Upload, FileText, 
  FolderOpen, BookOpen, Filter, Plus, Search,
  File, Video, Music, Image, Archive
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseResourcesPage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const { data: courseData } = useCourse(courseId);
  const { data: modulesData } = useModules(courseId);
  const { data: resources } = useCourseResources(courseId);
  const { mutate: createResource, isPending: creating } = useCreateCourseResource();
  const { mutate: deleteResource, isPending: deleting } = useDeleteCourseResource();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const course = Array.isArray(courseData) ? courseData[0] : courseData;
  const modules = Array.isArray(modulesData) ? modulesData : (modulesData as any)?.data || [];
  
  const resourceList = useMemo(() => {
    const list = Array.isArray(resources) ? resources : (resources as any)?.data || [];
    return list;
  }, [resources]);

  // Filter resources by module and search
  const filteredResources = useMemo(() => {
    return resourceList.filter((resource: any) => {
      const matchesModule = selectedModuleFilter === 'all' || 
        String(resource.module_id) === selectedModuleFilter ||
        (selectedModuleFilter === 'none' && !resource.module_id);
      
      const matchesSearch = !searchTerm || 
        (resource.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesModule && matchesSearch;
    });
  }, [resourceList, selectedModuleFilter, searchTerm]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setExternalLink('');
    setFile(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!file && !externalLink.trim()) {
      toast.error('Add a file or external link');
      return;
    }

    // Create JSON payload instead of FormData
    const payload: any = {
      title: title.trim(),
      description: description.trim() || '',
    };

    if (externalLink.trim()) {
      payload.external_link = externalLink.trim();
    }

    if (file) {
      payload.file_upload = file;
    }

    if (selectedModuleFilter !== 'all' && selectedModuleFilter !== 'none') {
      payload.module_id = parseInt(selectedModuleFilter);
    }

    // Use the mutation
    createResource(
      { courseId, data: payload },
      {
        onSuccess: () => {
          resetForm();
          toast.success('Resource added successfully');
        },
        onError: (error: any) => {
          const message = error.response?.data?.errors?.error || 
                         error.response?.data?.message || 
                         'Failed to add resource';
          toast.error(message);
        }
      }
    );
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return <File size={18} />;
      case 'mp4':
      case 'webm': return <Video size={18} />;
      case 'mp3':
      case 'wav': return <Music size={18} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return <Image size={18} />;
      case 'zip':
      case 'rar': return <Archive size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <Card className="p-8 bg-[var(--color-bg-card)]/60 border-[var(--color-border)] rounded-[2rem] shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-[var(--color-text-primary)]">
              {course?.title || 'Course'} - Resources
            </h1>
            <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
              Upload files or add links organized by module
            </p>
          </div>
          <Badge variant="primary" className="text-sm">
            {resourceList.length} Resource{resourceList.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-[#5A5A6E]" />
          <span className="text-sm font-semibold text-[#5A5A6E]">Filter by Module:</span>
        </div>
        <select
          value={selectedModuleFilter}
          onChange={(e) => setSelectedModuleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold min-w-[200px]"
        >
          <option value="all">All Modules</option>
          <option value="none">No Module (General)</option>
          {modules.map((module: any) => (
            <option key={module.id} value={String(module.id)}>
              {module.order_number}. {module.title}
            </option>
          ))}
        </select>

        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A5A6E]" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium outline-none focus:ring-2 focus:ring-[#0A5C4A]/20"
          />
        </div>
      </div>

      {/* Add Resource Form */}
      <Card className="p-8 bg-[var(--color-bg-card)]/60 border-[var(--color-border)] rounded-[2rem] shadow-xl">
        <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <Plus size={20} /> Add Resource
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Title"
            placeholder="Resource title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            required
          />
          <Input
            label="External Link"
            placeholder="https://..."
            value={externalLink}
            onChange={(event) => setExternalLink(event.target.value)}
          />
          <div className="md:col-span-2">
            <Input
              label="Description"
              placeholder="Optional description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Upload File</label>
            <input
              type="file"
              onChange={(event) => setFile(event.target.files?.[0] || null)}
              className="w-full border border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-bg)] cursor-pointer"
            />
            {file && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>
          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" size="lg" loading={creating} className="rounded-xl">
              <Upload size={16} className="mr-2" /> Add Resource
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={resetForm} className="rounded-xl">
              Clear
            </Button>
          </div>
        </form>
      </Card>

      {/* Resources List - Grouped by Module */}
      <Card className="p-8 bg-[var(--color-bg-card)]/60 border-[var(--color-border)] rounded-[2rem] shadow-xl">
        <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <FolderOpen size={20} /> Existing Resources
        </h2>
        
        {filteredResources.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-[#5A5A6E] mx-auto mb-4 opacity-30" />
            <p className="text-[var(--color-text-secondary)] font-medium">
              {searchTerm || selectedModuleFilter !== 'all' 
                ? 'No resources match your filters' 
                : 'No resources added yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedModuleFilter === 'all' ? (
              // Group by module when viewing all
              <>
                {/* Ungrouped resources */}
                {filteredResources.filter((r: any) => !r.module_id).length > 0 && (
                  <div>
                    <h3 className="text-sm font-black text-[#5A5A6E] uppercase tracking-widest mb-3">
                      General Resources
                    </h3>
                    <div className="space-y-3">
                      {filteredResources
                        .filter((r: any) => !r.module_id)
                        .map((resource: any) => (
                          <ResourceItem 
                            key={resource.id} 
                            resource={resource} 
                            courseId={courseId}
                            onDelete={deleteResource}
                            isDeleting={deleting}
                          />
                        ))}
                    </div>
                  </div>
                )}
                
                {/* Grouped by module */}
                {modules.map((module: any) => {
                  const moduleResources = filteredResources.filter(
                    (r: any) => String(r.module_id) === String(module.id)
                  );
                  if (moduleResources.length === 0) return null;
                  
                  return (
                    <div key={module.id}>
                      <h3 className="text-sm font-black text-[#5A5A6E] uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BookOpen size={14} />
                        Module {module.order_number}: {module.title}
                        <Badge variant="outline" className="text-xs">{moduleResources.length}</Badge>
                      </h3>
                      <div className="space-y-3">
                        {moduleResources.map((resource: any) => (
                          <ResourceItem 
                            key={resource.id} 
                            resource={resource} 
                            courseId={courseId}
                            onDelete={deleteResource}
                            isDeleting={deleting}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              // Flat list when filtering
              <div className="space-y-3">
                {filteredResources.map((resource: any) => (
                  <ResourceItem 
                    key={resource.id} 
                    resource={resource} 
                    courseId={courseId}
                    onDelete={deleteResource}
                    isDeleting={deleting}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}

// Resource Item Component
function ResourceItem({ resource, courseId, onDelete, isDeleting }: {
  resource: any;
  courseId: number;
  onDelete: any;
  isDeleting: boolean;
}) {
  const href = resource.external_link || resource.file_url;
  const isExternal = !!resource.external_link;
  const label = resource.title || resource.file_name || resource.external_link;
  const fileExt = resource.file_name?.split('.').pop()?.toLowerCase();

  const getFileIcon = (ext: string) => {
    switch (ext) {
      case 'pdf': return <File size={18} />;
      case 'mp4':
      case 'webm': return <Video size={18} />;
      case 'mp3':
      case 'wav': return <Music size={18} />;
      case 'jpg':
      case 'jpeg':
      case 'png': return <Image size={18} />;
      case 'zip':
      case 'rar': return <Archive size={18} />;
      default: return <FileText size={18} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
          {isExternal ? <ExternalLink size={18} /> : getFileIcon(fileExt || '')}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">{label}</p>
          {resource.description && (
            <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
              {resource.description}
            </p>
          )}
          {resource.file_size && (
            <p className="text-[10px] text-[#5A5A6E] mt-0.5">
              {(resource.file_size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-lg text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
          >
            {isExternal ? 'Open' : 'Download'}
          </a>
        ) : null}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete({ courseId, resourceId: resource.id })}
          loading={isDeleting}
          className="text-red-500 hover:bg-red-50"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </motion.div>
  );
}