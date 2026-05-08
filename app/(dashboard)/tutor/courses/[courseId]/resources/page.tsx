'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { 
  useCourse, useCourseResources, useCreateCourseResource, 
  useDeleteCourseResource, useModules 
} from '@/lib/hooks/useCourses';
import { useLiveSessions } from '@/lib/hooks/useLiveSessions';
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
  const { data: liveSessionsData } = useLiveSessions(courseId);
  const { data: resources } = useCourseResources(courseId);
  const { mutate: createResource, isPending: creating } = useCreateCourseResource();
  const { mutate: deleteResource, isPending: deleting } = useDeleteCourseResource();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [resourceType, setResourceType] = useState<'file' | 'link'>('file');
  const [assignTo, setAssignTo] = useState<string>('none');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const course = Array.isArray(courseData) ? courseData[0] : courseData;
  const isLive = course?.course_type === 'live';
  const modules = Array.isArray(modulesData) ? modulesData : (modulesData as any)?.data || [];
  const liveSessions = Array.isArray(liveSessionsData) ? liveSessionsData : (liveSessionsData as any)?.data || [];
  
  const resourceList = useMemo(() => {
    const list = Array.isArray(resources) ? resources : (resources as any)?.data || [];
    return list;
  }, [resources]);

  // Filter resources by module/session and search
  const filteredResources = useMemo(() => {
    return resourceList.filter((resource: any) => {
      const matchId = isLive ? resource.live_session_id : resource.module_id;
      const matchesModule = selectedModuleFilter === 'all' || 
        String(matchId) === selectedModuleFilter ||
        (selectedModuleFilter === 'none' && !matchId);
      
      const matchesSearch = !searchTerm || 
        (resource.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesModule && matchesSearch;
    });
  }, [resourceList, selectedModuleFilter, searchTerm, isLive]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setExternalLink('');
    setFile(null);
    setResourceType('file');
    setAssignTo('none');
    // Reset file input
    const fileInput = document.getElementById('resource-file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (resourceType === 'file' && !file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (resourceType === 'link' && !externalLink.trim()) {
      toast.error('Please enter an external link URL');
      return;
    }

    const payload: any = {
      title: title.trim(),
      description: description.trim() || '',
    };

    if (resourceType === 'link' && externalLink.trim()) {
      payload.external_link = externalLink.trim();
    }

    if (resourceType === 'file' && file) {
      payload.file_upload = file;
    }

    if (assignTo !== 'none') {
      if (isLive) {
        payload.live_session_id = parseInt(assignTo);
      } else {
        payload.module_id = parseInt(assignTo);
      }
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
              Upload files or add links organized by {isLive ? 'live session' : 'module'}
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
          <option value="all">All {isLive ? 'Sessions' : 'Modules'}</option>
          <option value="none">No {isLive ? 'Session' : 'Module'} (General)</option>
          {isLive ? (
            liveSessions.map((session: any) => (
              <option key={session.id} value={String(session.id)}>
                Day {session.day_number}: {session.title}
              </option>
            ))
          ) : (
            modules.map((module: any) => (
              <option key={module.id} value={String(module.id)}>
                {module.order_number}. {module.title}
              </option>
            ))
          )}
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
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Resource Type Toggle */}
          <div>
            <label className="block text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-3">Resource Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setResourceType('file')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  resourceType === 'file'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40'
                }`}
              >
                <Upload size={16} /> Upload File
              </button>
              <button
                type="button"
                onClick={() => setResourceType('link')}
                className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm border-2 transition-all ${
                  resourceType === 'link'
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]/40'
                }`}
              >
                <ExternalLink size={16} /> External Link
              </button>
            </div>
          </div>

          {/* Title + Assign To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Title *"
              placeholder="e.g. Week 1 Slides, Reference Article"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <div>
              <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">
                Assign to {isLive ? 'Session' : 'Module'}
              </label>
              <select
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-sm font-semibold outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]/40"
              >
                <option value="none">General (no {isLive ? 'session' : 'module'})</option>
                {isLive ? (
                  liveSessions.map((s: any) => (
                    <option key={s.id} value={String(s.id)}>Day {s.day_number}: {s.title}</option>
                  ))
                ) : (
                  modules.map((m: any) => (
                    <option key={m.id} value={String(m.id)}>{m.order_number}. {m.title}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Description */}
          <Input
            label="Description"
            placeholder="Optional description (shown to students)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* File Upload or External Link */}
          {resourceType === 'file' ? (
            <div>
              <label className="block text-sm font-bold text-[var(--color-text-primary)] mb-2">Upload File *</label>
              <label
                htmlFor="resource-file-input"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
                  file
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-primary)]/5'
                }`}
              >
                {file ? (
                  <>
                    <FileText size={28} className="text-[var(--color-primary)] mb-2" />
                    <p className="text-sm font-bold text-[var(--color-primary)]">{file.name}</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                  </>
                ) : (
                  <>
                    <Upload size={28} className="text-[var(--color-text-secondary)] mb-2" />
                    <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Click to select a file</p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-1">PDF, Video, Image, ZIP, and more</p>
                  </>
                )}
                <input
                  id="resource-file-input"
                  type="file"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </label>
              <p className="text-xs text-[var(--color-text-secondary)] mt-2 flex items-center gap-1">
                <FileText size={11} /> Uploaded files will open directly in the student view (no new tab).
              </p>
            </div>
          ) : (
            <div>
              <Input
                label="External URL *"
                placeholder="https://docs.google.com/..."
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                type="url"
              />
              <p className="text-xs text-[var(--color-text-secondary)] mt-2 flex items-center gap-1">
                <ExternalLink size={11} /> External links will open in a new tab for students.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4 pt-2">
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
                        .filter((r: any) => !(isLive ? r.live_session_id : r.module_id))
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
                
                {/* Grouped by module/session */}
                {isLive ? (
                  liveSessions.map((session: any) => {
                    const sessionResources = filteredResources.filter(
                      (r: any) => String(r.live_session_id) === String(session.id)
                    );
                    if (sessionResources.length === 0) return null;
                    
                    return (
                      <div key={session.id}>
                        <h3 className="text-sm font-black text-[#5A5A6E] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <BookOpen size={14} />
                          Day {session.day_number}: {session.title}
                          <Badge variant="outline" className="text-xs">{sessionResources.length}</Badge>
                        </h3>
                        <div className="space-y-3">
                          {sessionResources.map((resource: any) => (
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
                  })
                ) : (
                  modules.map((module: any) => {
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
                  })
                )}
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
          isExternal ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors flex items-center gap-1"
            >
              <ExternalLink size={14} /> Open
            </a>
          ) : (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-lg text-sm font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors flex items-center gap-1"
            >
              <Download size={14} /> Download/View
            </a>
          )
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