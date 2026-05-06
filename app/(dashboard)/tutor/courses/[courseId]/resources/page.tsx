'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCourse, useCourseResources, useCreateCourseResource, useDeleteCourseResource } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Download, ExternalLink, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CourseResourcesPage() {
  const params = useParams();
  const courseId = Number(params.courseId);

  const { data: course } = useCourse(courseId);
  const { data: resources } = useCourseResources(courseId);
  const { mutate: createResource, isPending: creating } = useCreateCourseResource();
  const { mutate: deleteResource, isPending: deleting } = useDeleteCourseResource();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const resourceList = useMemo(() => {
    if (Array.isArray(resources)) return resources;
    return (resources as any)?.data || [];
  }, [resources]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setExternalLink('');
    setFile(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!file && !externalLink.trim()) {
      toast.error('Add a file or external link');
      return;
    }

    const payload = new FormData();
    payload.append('title', title.trim());
    if (description.trim()) payload.append('description', description.trim());
    if (externalLink.trim()) payload.append('external_link', externalLink.trim());
    if (file) payload.append('file', file);

    createResource(
      { courseId, data: payload },
      {
        onSuccess: () => {
          resetForm();
        },
      },
    );
  };

  const courseTitle = (course as any)?.title || 'Course Resources';

  return (
    <div className="space-y-8 pb-10">
      <Card className="p-8 bg-[var(--color-bg-card)]/60 border-[var(--color-border)] rounded-[2rem] shadow-xl">
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">{courseTitle}</h1>
        <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
          Upload files or add links for students.
        </p>
      </Card>

      <Card className="p-8 bg-[var(--color-bg-card)]/60 border-[var(--color-border)] rounded-[2rem] shadow-xl">
        <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-6">Add Resource</h2>
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
              className="w-full border border-[var(--color-border)] rounded-xl p-3 bg-[var(--color-bg)]"
            />
            {file && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">Selected: {file.name}</p>
            )}
          </div>
          <div className="md:col-span-2 flex gap-4">
            <Button type="submit" size="lg" loading={creating} className="rounded-xl">
              Add Resource
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={resetForm} className="rounded-xl">
              Clear
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-8 bg-[var(--color-bg-card)]/60 border-[var(--color-border)] rounded-[2rem] shadow-xl">
        <h2 className="text-xl font-black text-[var(--color-text-primary)] mb-6">Existing Resources</h2>
        {resourceList.length === 0 ? (
          <p className="text-sm text-[var(--color-text-secondary)]">No resources added yet.</p>
        ) : (
          <div className="space-y-4">
            {resourceList.map((resource: any) => {
              const href = resource.external_link || resource.file_url;
              const isExternal = !!resource.external_link;
              const label = resource.title || resource.file_name || resource.external_link;

              return (
                <div
                  key={resource.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)]/40"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                      {isExternal ? <ExternalLink size={18} /> : <Download size={18} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{label}</p>
                      {resource.description && (
                        <p className="text-xs text-[var(--color-text-secondary)] line-clamp-1">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {href ? (
                      <Button asChild variant="ghost" size="sm" className="text-[var(--color-primary)] font-bold">
                        <a href={href} target="_blank" rel="noreferrer">
                          {isExternal ? 'Open' : 'Download'}
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteResource({ courseId, resourceId: resource.id })}
                      loading={deleting}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
