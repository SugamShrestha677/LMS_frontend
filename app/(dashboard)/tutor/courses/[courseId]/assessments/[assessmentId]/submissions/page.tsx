'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { 
  Eye, CheckCircle, XCircle, FileText, Download,
  Clock, User, Star, Calendar, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/services/api';
import { format } from 'date-fns';

const normalizeList = (value: unknown) => {
  if (Array.isArray(value)) return value;

  const candidate = value as { data?: unknown; results?: unknown } | null;
  if (!candidate || typeof candidate !== 'object') return [];

  return (Array.isArray(candidate.data) && candidate.data)
    || (Array.isArray(candidate.results) && candidate.results)
    || [];
};

export default function AssessmentSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = Number(params.courseId);
  const assessmentId = Number(params.assessmentId);
  
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isGradingModal, setIsGradingModal] = useState(false);
  const [feedback, setFeedback] = useState('');

  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['assessment-submissions', assessmentId],
    queryFn: async () => {
      const response = await api.get(`/student-assessments/?assessment=${assessmentId}`);
      return normalizeList(response.data?.data ?? response.data);
    },
    enabled: !!assessmentId,
  });

  const { data: assessmentData } = useQuery({
    queryKey: ['assessment', assessmentId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/assessments/${assessmentId}/`);
      return response.data?.data || response.data;
    },
    enabled: !!assessmentId,
  });

  const submissions = normalizeList(submissionsData);

  const gradeMutation = useMutation({
    mutationFn: async (data: { id: number; feedback: string }) => {
      return api.post(`/student-assessments/${data.id}/feedback/`, {
        feedback: data.feedback,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-submissions', assessmentId] });
      setIsGradingModal(false);
      setSelectedSubmission(null);
      setFeedback('');
      toast.success('Feedback sent successfully!');
    },
    onError: () => {
      toast.error('Failed to send feedback');
    },
  });

  const openGradingModal = (submission: any) => {
    setSelectedSubmission(submission);
    setFeedback(submission.feedback || '');
    setIsGradingModal(true);
  };

  const submitFeedback = () => {
    if (!selectedSubmission || !assessmentData) return;

    gradeMutation.mutate({
      id: selectedSubmission.id,
      feedback,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'warning';
      case 'graded': return 'success';
      case 'auto_submitted': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E2A]">Submissions</h1>
          <p className="text-[#5A5A6E] mt-1">Review student submissions and send feedback</p>
        </div>
      </div>

      {assessmentData && (
        <Card className="p-6 bg-[#0A5C4A]/5 border border-[#0A5C4A]/20">
          <h2 className="text-xl font-black text-[#0A5C4A]">{assessmentData.title}</h2>
          <p className="text-[#5A5A6E] mt-2">{assessmentData.description}</p>
          <div className="flex gap-4 mt-4">
            <Badge variant="outline">{assessmentData.assessment_type}</Badge>
            <Badge variant="outline">Max Score: {assessmentData.max_score}</Badge>
            <Badge variant="outline">Passing: {assessmentData.passing_score}%</Badge>
          </div>
        </Card>
      )}

      {isLoading ? (
        <Card className="p-8 text-center">
          <div className="w-8 h-8 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin mx-auto" />
        </Card>
      ) : submissions.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText size={48} className="text-[#5A5A6E] mx-auto mb-4 opacity-50" />
          <p className="text-[#5A5A6E]">No submissions yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission: any) => (
            <Card key={submission.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="font-bold text-[#1E1E2A]">
                      {submission.student_name || submission.student_email}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-[#5A5A6E] mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> Submitted: {format(new Date(submission.submitted_at), 'PPp')}
                      </span>
                      {submission.time_taken_minutes > 0 && (
                        <span>Time: {submission.time_taken_minutes} min</span>
                      )}
                      {submission.tab_switch_count > 0 && (
                        <span className="text-orange-500">
                          Tab switches: {submission.tab_switch_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={getStatusColor(submission.status)}>
                    {submission.status}
                  </Badge>
                  {submission.score !== null && submission.score !== undefined && (
                    <Badge variant={submission.passed ? 'success' : 'danger'}>
                      Score: {submission.score}%
                    </Badge>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openGradingModal(submission)}
                  >
                    <Eye size={14} className="mr-1" />
                    {submission.feedback ? 'View/Edit Feedback' : 'Send Feedback'}
                  </Button>
                </div>
              </div>

              {/* File download link */}
              {submission.submission_file && (
                <div className="mt-3 ml-14">
                  <a
                    href={submission.submission_file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#0A5C4A] hover:underline"
                  >
                    <Download size={14} />
                    Download submission file
                  </a>
                </div>
              )}

              {/* Text submission preview */}
              {submission.submission_text && (
                <div className="mt-3 ml-14 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-[#5A5A6E] line-clamp-3">
                    {submission.submission_text}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Grading Modal */}
      <Modal
        open={isGradingModal}
        onClose={() => setIsGradingModal(false)}
        title="Review Submission"
        size="xl"
      >
        {selectedSubmission && (
          <div className="space-y-6 pt-4">
            {/* Student info */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-semibold">
                {selectedSubmission.student_name || selectedSubmission.student_email}
              </p>
              <p className="text-sm text-[#5A5A6E]">
                Submitted: {format(new Date(selectedSubmission.submitted_at), 'PPp')}
              </p>
              {selectedSubmission.tab_switch_count > 0 && (
                <p className="text-sm text-orange-500 mt-1">
                  Tab switches: {selectedSubmission.tab_switch_count}
                </p>
              )}
              {selectedSubmission.score !== null && selectedSubmission.score !== undefined && (
                <p className="text-sm text-[#0A5C4A] mt-2 font-semibold">
                  Current score: {selectedSubmission.score}% {selectedSubmission.passed ? '(passed)' : '(not passed)'}
                </p>
              )}
            </div>

            {/* File link */}
            {selectedSubmission.submission_file && (
              <a
                href={selectedSubmission.submission_file}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#0A5C4A] hover:underline"
              >
                <Download size={16} />
                View submitted file
              </a>
            )}

            {/* Submission text */}
            {selectedSubmission.submission_text && (
              <div>
                <label className="block text-sm font-semibold mb-2">Submission Content</label>
                <div className="p-4 bg-gray-50 rounded-xl max-h-60 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{selectedSubmission.submission_text}</p>
                </div>
              </div>
            )}

            {/* Exam/Quiz Answers */}
            {assessmentData && assessmentData.questions && assessmentData.questions.length > 0 && selectedSubmission.answers && (
              <div>
                 <label className="block text-sm font-bold mb-4 text-[#0A5C4A]">Questions & Review</label>
                <div className="space-y-6 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                   {assessmentData.questions.map((q: any, idx: number) => {
                    const rawAns = selectedSubmission.answers[idx];
                    const ans = typeof rawAns === 'object' ? rawAns.value : rawAns;
                    const isMCQ = q.type !== 'long_answer';
                    const isCorrect = isMCQ && String(ans) === String(q.correct);
                    
                    return (
                      <div key={idx} className={`p-6 border-2 rounded-2xl transition-all ${
                        isMCQ ? (isCorrect ? 'border-green-100 bg-green-50/30' : 'border-red-100 bg-red-50/30') : 'border-gray-100 bg-white shadow-sm'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="font-bold">Q{idx + 1}</Badge>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{isMCQ ? 'MCQ' : 'Long Answer'}</Badge>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                              Max Points: {q.points || 10}
                            </span>
                            {isMCQ && (
                              <Badge variant={isCorrect ? 'success' : 'danger'}>
                                {isCorrect ? `${q.points || 10} pts` : '0 pts'}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <p className="font-bold text-[#1E1E2A] mb-4">{q.question}</p>
                        
                        {isMCQ ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {q.options.map((opt: string, optIdx: number) => {
                              const isSelected = String(ans) === String(optIdx);
                              const isCorrectOption = String(optIdx) === String(q.correct);
                              return (
                                <div key={optIdx} className={`p-3 rounded-xl text-xs flex items-center gap-3 border ${
                                  isCorrectOption ? 'border-green-500 bg-green-100 font-bold' :
                                  isSelected ? 'border-red-500 bg-red-100' : 'border-gray-100 bg-white'
                                }`}>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-black ${
                                    isCorrectOption ? 'bg-green-500 text-white' : 'bg-gray-50'
                                  }`}>
                                    {String.fromCharCode(65 + optIdx)}
                                  </div>
                                  <span className="flex-1">{opt}</span>
                                  {isCorrectOption && <span className="text-[8px] text-green-600 font-black">CORRECT</span>}
                                  {isSelected && !isCorrectOption && <span className="text-[8px] text-red-600 font-black">STUDENT&apos;S</span>}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Student Response</p>
                            <p className="text-sm whitespace-pre-wrap text-[#1E1E2A] leading-relaxed">
                              {ans || <span className="text-gray-400 italic">No answer provided</span>}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feedback details */}
            <div className="grid grid-cols-1 gap-6 p-6 bg-(--color-primary)/5 rounded-3xl border-2 border-(--color-primary)/10">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[#0A5C4A]">Feedback visibility</p>
                  <p className="text-xs text-gray-500 mt-1">Only the selected student can view this feedback on their own submission.</p>
                </div>
                <Badge variant={selectedSubmission.feedback ? 'success' : 'outline'}>
                  {selectedSubmission.feedback ? 'Feedback saved' : 'No feedback yet'}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#0A5C4A]">Overall Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Share constructive feedback with the student..."
                className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-[#0A5C4A] focus:ring-0 resize-none text-sm font-medium transition-all"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" size="lg" onClick={() => setIsGradingModal(false)} className="flex-1 rounded-2xl h-14 font-black">
                Discard
              </Button>
              <Button size="lg" onClick={submitFeedback} loading={gradeMutation.isPending} className="flex-1 rounded-2xl h-14 font-black shadow-lg">
                {selectedSubmission.feedback ? 'Update Feedback' : 'Send Feedback'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}