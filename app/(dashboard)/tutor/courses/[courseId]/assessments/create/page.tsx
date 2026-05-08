'use client';

import { useParams, useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { useState, useCallback } from 'react';
import { useCreateAssessment, useModules, useCourse } from '@/lib/hooks/useCourses';
import { useLiveSessions } from '@/lib/hooks/useLiveSessions';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  Plus, Trash2, X, Monitor, ClipboardCheck, Upload,
  Clock, Calendar, Timer, FileText, AlertCircle,
  CheckCircle, Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const assessmentTypes = [
  { 
    value: 'quiz', 
    label: 'Quiz', 
    icon: Monitor,
    description: 'Auto-graded multiple choice quiz with instant results',
    color: 'blue'
  },
  { 
    value: 'exam', 
    label: 'Exam', 
    icon: ClipboardCheck,
    description: 'Mix of MCQ & long answer questions, manual grading',
    color: 'purple'
  },
  { 
    value: 'assignment', 
    label: 'Assignment', 
    icon: Upload,
    description: 'File upload or text submission with deadline',
    color: 'orange'
  },
];

const questionTypes = [
  { value: 'mcq', label: 'Multiple Choice', icon: CheckCircle },
  { value: 'long_answer', label: 'Long Answer', icon: Edit3 },
];

const fileTypeOptions = [
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'Word' },
  { value: 'zip', label: 'ZIP' },
  { value: 'mp3', label: 'MP3 Audio' },
  { value: 'mp4', label: 'MP4 Video' },
  { value: 'jpg', label: 'JPG' },
  { value: 'png', label: 'PNG' },
];

export default function CreateAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.courseId);
  
  const { data: courseData } = useCourse(courseId);
  const course = Array.isArray(courseData) ? courseData[0] : courseData;
  const isLive = course?.course_type === 'live';
  
  const { data: modulesData } = useModules(courseId);
  const modules = Array.isArray(modulesData) ? modulesData : (modulesData as any)?.data || [];
  
  const { data: liveSessionsData } = useLiveSessions(courseId);
  const liveSessions = Array.isArray(liveSessionsData) ? liveSessionsData : (liveSessionsData as any)?.data || [];
  
  const { mutate: createAssessment, isPending } = useCreateAssessment();
  const [selectedType, setSelectedType] = useState('quiz');
  const [allowedFileTypes, setAllowedFileTypes] = useState<string[]>(['pdf']);
  
  const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      assessment_type: 'quiz',
      max_score: 100,
      passing_score: 60,
      duration_minutes: 30,
      track_tab_switching: true,
      max_tab_switches: 3,
      max_file_size_mb: 10,
      allow_late_submission: false,
      submission_type: 'file',
      questions: [
        { type: 'mcq', question: '', options: ['', '', '', ''], correct: 0, points: 10 }
      ]
    }
  });

  const { fields, append, remove, update } = useFieldArray({ control, name: 'questions' });
  const assessmentType = watch('assessment_type');

  // Instant type switching
  const handleTypeChange = useCallback((type: string) => {
    setSelectedType(type);
    setValue('assessment_type', type, { shouldDirty: true });
    
    // Reset questions based on type
    if (type === 'quiz') {
      // Quiz: only MCQ
      setValue('questions', [
        { type: 'mcq', question: '', options: ['', '', '', ''], correct: 0, points: 10 }
      ]);
    } else if (type === 'exam') {
      // Exam: mix of MCQ and long answer
      setValue('questions', [
        { type: 'mcq', question: '', options: ['', '', '', ''], correct: 0, points: 10 }
      ]);
    } else if (type === 'assignment') {
      // Assignment: no questions needed
      setValue('questions', []);
    }
  }, [setValue]);

  const toggleFileType = (type: string) => {
    setAllowedFileTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const addQuestion = (type: 'mcq' | 'long_answer' = 'mcq') => {
    if (type === 'mcq') {
      append({ type: 'mcq', question: '', options: ['', '', '', ''], correct: 0, points: 10 });
    } else {
      append({ type: 'long_answer', question: '', points: 20, word_limit: 500 });
    }
  };

  const changeQuestionType = (index: number, newType: string) => {
    if (newType === 'mcq') {
      update(index, { type: 'mcq', question: '', options: ['', '', '', ''], correct: 0, points: 10 });
    } else {
      update(index, { type: 'long_answer', question: '', points: 20, word_limit: 500 });
    }
  };

  const onSubmit = (data: any) => {
    // Filter out empty questions
    if (data.assessment_type !== 'assignment') {
      data.questions = data.questions.filter((q: any) => q.question?.trim());
    } else {
      delete data.questions;
    }

    const payload = {
      ...data,
      allowed_file_types: allowedFileTypes.join(','),
      start_datetime: data.start_datetime ? new Date(data.start_datetime).toISOString() : null,
      end_datetime: data.end_datetime ? new Date(data.end_datetime).toISOString() : null,
      late_submission_deadline: data.allow_late_submission && data.late_submission_deadline 
        ? new Date(data.late_submission_deadline).toISOString() 
        : null,
    };
    
    // Switch payload keys for live vs self-paced
    if (isLive && data.module) {
      payload.live_session = data.module; // we temporarily used the 'module' field in react-hook-form
      delete payload.module;
    }

    createAssessment(
      { courseId, data: payload },
      { onSuccess: () => router.push(`/tutor/courses/${courseId}/assessments`) }
    );
  };

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-[var(--color-text-primary)]">Create Assessment</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">
          Choose assessment type and configure settings
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
        {/* Type Selection - Instant switching */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Assessment Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assessmentTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleTypeChange(type.value)}
                className={`relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedType === type.value
                    ? 'border-[#0A5C4A] bg-[#0A5C4A]/5 shadow-lg shadow-[#0A5C4A]/10'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <type.icon 
                  size={32} 
                  className={`mb-3 ${selectedType === type.value ? 'text-[#0A5C4A]' : 'text-gray-400'}`} 
                />
                <span className={`font-bold text-sm ${selectedType === type.value ? 'text-[#0A5C4A]' : 'text-gray-600'}`}>
                  {type.label}
                </span>
                <span className="text-xs text-[#5A5A6E] text-center mt-1">{type.description}</span>
                
                {selectedType === type.value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-[#0A5C4A] rounded-full flex items-center justify-center"
                  >
                    <CheckCircle size={14} className="text-white" />
                  </motion.div>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Basic Details */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Assessment Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Title" 
              {...register('title', { required: 'Title is required' })} 
              error={errors.title?.message}
              placeholder="e.g., Final Examination"
            />
            <div className="space-y-1">
              <label className="block text-sm font-semibold">{isLive ? 'Live Session' : 'Module'} (Optional)</label>
              <select {...register('module')} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white">
                <option value="">No specific {isLive ? 'session' : 'module'}</option>
                {isLive ? (
                  liveSessions.map((s: any) => (
                    <option key={s.id} value={s.id}>Day {s.day_number}: {s.title}</option>
                  ))
                ) : (
                  modules.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.title}</option>
                  ))
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Input label="Max Score" type="number" {...register('max_score', { valueAsNumber: true })} />
            <Input label="Passing Score (%)" type="number" {...register('passing_score', { valueAsNumber: true })} />
            {(selectedType === 'quiz' || selectedType === 'exam') && (
              <Input label="Duration (minutes)" type="number" {...register('duration_minutes', { valueAsNumber: true })} />
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-semibold mb-1">Description</label>
            <textarea 
              {...register('description')} 
              rows={3} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none bg-white"
              placeholder="Instructions for students..."
            />
          </div>
        </Card>

        {/* Time Settings */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock size={20} /> Time Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-semibold">Start Date & Time</label>
              <input
                type="datetime-local"
                {...register('start_datetime')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-semibold">End Date & Time (Deadline)</label>
              <input
                type="datetime-local"
                {...register('end_datetime')}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
              />
            </div>
          </div>
        </Card>

        {/* Proctoring (Quiz & Exam) */}
        {(selectedType === 'quiz' || selectedType === 'exam') && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Monitor size={20} /> Proctoring Settings
            </h3>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" {...register('track_tab_switching')} className="w-4 h-4 rounded accent-[#0A5C4A]" />
                <span className="font-semibold text-sm">Track tab switching</span>
              </label>
              {watch('track_tab_switching') && (
                <Input
                  label="Max Tab Switches Before Auto-Submit"
                  type="number"
                  {...register('max_tab_switches', { valueAsNumber: true })}
                />
              )}
              <div className="p-3 bg-amber-50 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  Student will be warned on each tab switch. After exceeding the limit, the assessment will auto-submit.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Assignment Settings */}
        {selectedType === 'assignment' && (
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Upload size={20} /> Submission Settings
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-semibold">Submission Type</label>
                <select {...register('submission_type')} className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white">
                  <option value="file">File Upload Only</option>
                  <option value="text">Text Entry Only</option>
                  <option value="multiple">File + Text</option>
                </select>
              </div>

              <Input label="Max File Size (MB)" type="number" {...register('max_file_size_mb', { valueAsNumber: true })} />

              <div>
                <label className="block text-sm font-semibold mb-2">Allowed File Types</label>
                <div className="flex flex-wrap gap-2">
                  {fileTypeOptions.map(ft => (
                    <button
                      key={ft.value}
                      type="button"
                      onClick={() => toggleFileType(ft.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        allowedFileTypes.includes(ft.value)
                          ? 'bg-[#0A5C4A] text-white shadow'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="flex items-center gap-3 cursor-pointer mb-4">
                  <input type="checkbox" {...register('allow_late_submission')} className="w-4 h-4 rounded accent-[#0A5C4A]" />
                  <span className="font-semibold text-sm">Allow late submission</span>
                </label>
                {watch('allow_late_submission') && (
                  <div className="space-y-1 ml-7">
                    <label className="block text-sm font-semibold">Late Submission Deadline</label>
                    <input
                      type="datetime-local"
                      {...register('late_submission_deadline')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Questions (Quiz & Exam) */}
        {(selectedType === 'quiz' || selectedType === 'exam') && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">
                Questions ({fields.length})
              </h3>
              <div className="flex items-center gap-2">
                {selectedType === 'exam' && (
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('long_answer')}>
                    <Edit3 size={14} className="mr-1" /> Long Answer
                  </Button>
                )}
                <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('mcq')}>
                  <Plus size={14} className="mr-1" /> MCQ
                </Button>
              </div>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-[#5A5A6E]">No questions added yet</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('mcq')}>
                    Add MCQ
                  </Button>
                  {selectedType === 'exam' && (
                    <Button type="button" variant="outline" size="sm" onClick={() => addQuestion('long_answer')}>
                      Add Long Answer
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-5 border border-gray-200 rounded-xl bg-white"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant={field.type === 'mcq' ? 'primary' : 'secondary'} className="text-xs">
                            {field.type === 'mcq' ? 'MCQ' : 'Long Answer'}
                          </Badge>
                          <h4 className="font-bold text-sm">Question {index + 1}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedType === 'exam' && (
                            <button
                              type="button"
                              onClick={() => changeQuestionType(index, field.type === 'mcq' ? 'long_answer' : 'mcq')}
                              className="text-xs text-[#5A5A6E] hover:text-[#0A5C4A] font-medium"
                            >
                              Switch to {field.type === 'mcq' ? 'Long Answer' : 'MCQ'}
                            </button>
                          )}
                          <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-red-500 hover:bg-red-50">
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                      
                      <Input
                        label="Question Text"
                        {...register(`questions.${index}.question`, { required: true })}
                        placeholder="Enter your question"
                      />
                      
                      {/* MCQ Options */}
                      {field.type === 'mcq' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {[0, 1, 2, 3].map((optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                {...register(`questions.${index}.correct`)}
                                value={optIdx}
                                className="w-4 h-4 accent-[#0A5C4A] flex-shrink-0"
                              />
                              <Input
                                placeholder={`Option ${optIdx + 1}`}
                                {...register(`questions.${index}.options.${optIdx}`, { required: true })}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Long Answer Settings */}
                      {field.type === 'long_answer' && (
                        <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                          <p className="text-xs text-purple-700 mb-2">
                            Student will provide a written answer. This will need manual grading.
                          </p>
                          <Input
                            label="Word Limit (optional)"
                            type="number"
                            {...register(`questions.${index}.word_limit`, { valueAsNumber: true })}
                            placeholder="e.g., 500"
                          />
                        </div>
                      )}
                      
                      <div className="mt-3 w-32">
                        <Input
                          label="Points"
                          type="number"
                          {...register(`questions.${index}.points`, { valueAsNumber: true })}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>
            )}
          </Card>
        )}

        {/* Submit */}
        <div className="flex gap-4 sticky bottom-4 bg-white p-4 rounded-2xl shadow-lg border z-10">
          <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" loading={isPending} className="flex-1">
            Create {assessmentTypes.find(t => t.value === selectedType)?.label || 'Assessment'}
          </Button>
        </div>
      </form>
    </div>
  );
}