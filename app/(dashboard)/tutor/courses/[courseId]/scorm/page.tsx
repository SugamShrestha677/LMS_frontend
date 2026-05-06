'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useCourse, useUploadScorm, useScormStatus } from '@/lib/hooks/useCourses';

export default function TutorCourseScormUploadPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = useMemo(() => Number(params.courseId), [params.courseId]);
  const { data: courseData, isLoading } = useCourse(Number.isNaN(courseId) ? 0 : courseId);
  const { mutate: uploadScorm, isPending } = useUploadScorm();

  const [scormFile, setScormFile] = useState<File | null>(null);

  const course = useMemo(() => {
    if (!courseData) return null;
    if (Array.isArray(courseData)) return courseData[0] ?? null;
    if (courseData && typeof courseData === 'object' && 'data' in courseData) {
      return (courseData as { data: any }).data;
    }
    return courseData as any;
  }, [courseData]);

  const scormJobId = course?.scorm_import_job_id as string | undefined;
  const { data: scormStatus } = useScormStatus(courseId, Boolean(scormJobId));

  const handleUpload = () => {
    if (!course || !scormFile) return;
    const formData = new FormData();
    formData.append('scorm_zip', scormFile);

    uploadScorm(
      { id: course.id, data: formData },
      {
        onSuccess: () => {
          setScormFile(null);
        },
      },
    );
  };

  if (!courseId || Number.isNaN(courseId)) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-sm text-[var(--color-text-secondary)]">Invalid course id.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[var(--color-text-primary)]">Upload SCORM</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            Upload a SCORM zip for this course.
          </p>
        </div>
        <Button variant="outline" onClick={() => router.push('/tutor/courses')}>Back to courses</Button>
      </div>

      <Card className="p-6 space-y-4">
        {isLoading ? (
          <p className="text-sm text-[var(--color-text-secondary)]">Loading course...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-bold text-[var(--color-text-primary)]">Course</p>
            <p className="text-sm text-[var(--color-text-secondary)]">{course?.title ?? 'Unknown'}</p>
            {course?.scorm_course_id && (
              <p className="text-xs text-[var(--color-text-secondary)]">SCORM Course ID: {course.scorm_course_id}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">SCORM Zip</label>
          <input
            type="file"
            accept=".zip,application/zip"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              setScormFile(file);
            }}
            className="w-full border border-[var(--color-border)] rounded-lg p-2"
          />
          {scormFile && (
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">Selected: {scormFile.name}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleUpload}
            loading={isPending}
            disabled={!scormFile || isPending}
          >
            Upload SCORM
          </Button>
          <span className="text-xs text-[var(--color-text-secondary)]">Max size depends on server limits.</span>
        </div>

        {scormJobId && (
          <div className="pt-2 text-xs text-[var(--color-text-secondary)]">
            Import job: {scormJobId} • Status: {scormStatus?.data?.status ?? 'PROCESSING'}
          </div>
        )}
      </Card>
    </div>
  );
}
