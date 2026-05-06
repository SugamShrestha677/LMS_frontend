'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState } from 'react';
import { useCreateAssessment } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, X } from 'lucide-react';

export default function CreateAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { mutate: createAssessment, isPending } = useCreateAssessment();
  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      assessment_type: 'quiz',
      max_score: 100,
      passing_score: 60,
      duration_minutes: 30,
      questions: [{ question: '', options: ['', '', '', ''], correct: 0, points: 10 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });

  const onSubmit = (data: any) => {
    createAssessment(
      { courseId, data },
      { onSuccess: () => router.push(`/tutor/courses/${courseId}/assessments`) }
    );
  };

  const addQuestion = () => {
    append({ question: '', options: ['', '', '', ''], correct: 0, points: 10 });
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Create Assessment</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">Add quizzes or exams to your course</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {/* Basic Info */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Assessment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" {...register('title', { required: true })} error={errors.title?.message} />
            <div className="space-y-1">
              <label className="block text-sm font-semibold">Type</label>
              <select {...register('assessment_type')} className="w-full px-4 py-3 rounded-lg border border-gray-300">
                <option value="quiz">Quiz</option>
                <option value="exam">Exam</option>
                <option value="assignment">Assignment</option>
              </select>
            </div>
            <Input label="Max Score" type="number" {...register('max_score', { valueAsNumber: true })} />
            <Input label="Passing Score (%)" type="number" {...register('passing_score', { valueAsNumber: true })} />
            <Input label="Duration (minutes)" type="number" {...register('duration_minutes', { valueAsNumber: true })} />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full px-4 py-3 rounded-lg border border-gray-300" />
          </div>
        </Card>

        {/* Questions */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Questions</h3>
            <Button type="button" variant="outline" onClick={addQuestion}>
              <Plus size={16} className="mr-1" /> Add Question
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="p-4 mb-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">Question {index + 1}</h4>
                <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500">
                  <X size={16} />
                </Button>
              </div>
              
              <Input
                label="Question Text"
                {...register(`questions.${index}.question`, { required: true })}
                placeholder="Enter your question"
              />
              
              <div className="grid grid-cols-2 gap-3 mt-3">
                {[0, 1, 2, 3].map((optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      {...register(`questions.${index}.correct`)}
                      value={optIdx}
                      className="w-4 h-4"
                    />
                    <Input
                      placeholder={`Option ${optIdx + 1}`}
                      {...register(`questions.${index}.options.${optIdx}`, { required: true })}
                    />
                  </div>
                ))}
              </div>
              
              <div className="mt-3 w-32">
                <Input
                  label="Points"
                  type="number"
                  {...register(`questions.${index}.points`, { valueAsNumber: true })}
                />
              </div>
            </div>
          ))}
        </Card>

        <div className="flex gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" loading={isPending}>Create Assessment</Button>
        </div>
      </form>
    </div>
  );
}