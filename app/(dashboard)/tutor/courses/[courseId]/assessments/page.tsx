'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAssessments, useDeleteAssessment } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit2, Trash2, GraduationCap, Clock, BarChart3 } from 'lucide-react';

export default function AssessmentsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { data: assessmentsData, isLoading } = useAssessments(courseId);
  const { mutate: deleteAssessment } = useDeleteAssessment();
  
  const assessments = Array.isArray(assessmentsData) ? assessmentsData : (assessmentsData as any)?.data || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Assessments</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Create quizzes, exams, and assignments</p>
        </div>
        <Button onClick={() => router.push(`/tutor/courses/${courseId}/assessments/create`)}>
          <Plus size={18} className="mr-2" /> Create Assessment
        </Button>
      </div>

      {assessments.length === 0 ? (
        <Card className="p-12 text-center">
          <GraduationCap size={48} className="text-[var(--color-text-secondary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">No assessments yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assessments.map((assessment: any) => (
            <Card key={assessment.id} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <GraduationCap size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-bold">{assessment.title}</h3>
                    <Badge variant="outline" className="text-xs capitalize">{assessment.assessment_type}</Badge>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-[var(--color-text-secondary)] mb-4">{assessment.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)] mb-4">
                <span className="flex items-center gap-1"><BarChart3 size={14} /> Pass: {assessment.passing_score}%</span>
                <span className="flex items-center gap-1"><Clock size={14} /> {assessment.duration_minutes} min</span>
                <span>Max: {assessment.max_score}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push(`/tutor/courses/${courseId}/assessments/${assessment.id}/edit`)}>
                  <Edit2 size={14} className="mr-1" /> Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteAssessment({ courseId, assessmentId: assessment.id })} className="text-red-500">
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}