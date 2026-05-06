'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { 
  Eye, CheckCircle, XCircle, FileText, Download,
  Clock, User, Star
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/services/api';
import { format } from 'date-fns';

export default function AssessmentSubmissionsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const courseId = Number(params.courseId);
  const assessmentId = Number(params.assessmentId);
  
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [isGradingModal, setIsGradingModal] = useState(false);
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');
  const [passed, setPassed] = useState(false);

  const { data: submissionsData, isLoading } = useQuery({
    queryKey: ['assessment-submissions', assessmentId],
    queryFn: async () => {
      const response = await api.get(`/student-assessments/?assessment=${assessmentId}`);
      return response.data?.data || response.data || [];
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

  const submissions = Array.isArray(submissionsData) ? submissionsData : [];

  const gradeMutation = useMutation({
    mutationFn: async (data: { id: number; score: number; feedback: string; passed: boolean }) => {
      return api.post(`/student-assessments/${data.id}/grade/`, {
        score: data.score,
        feedback: data.feedback,
        passed: data.passed,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assessment-submissions', assessmentId] });
      setIsGradingModal(false);
      setSelectedSubmission(null);
      setScore('');
      setFeedback('');
      setPassed(false);
      toast.success('Submission graded successfully!');
    },
    onError: () => {
      toast.error('Failed to grade submission');
    },
  });

  const openGradingModal = (submission: any) => {
    setSelectedSubmission(submission);
    setScore(submission.score || '');
    setFeedback(submission.feedback || '');
    setPassed(submission.passed || false);
    setIsGradingModal(true);
  };

  const submitGrade = () => {
    if (!selectedSubmission) return;
    
    gradeMutation.mutate({
      id: selectedSubmission.id,
      score: Number(score),
      feedback,
      passed,
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
          <p className="text-[#5A5A6E] mt-1">Grade and review student submissions</p>
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
                      {submission.score}% {submission.passed ? '✓' : '✗'}
                    </Badge>
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openGradingModal(submission)}
                  >
                    <Eye size={14} className="mr-1" />
                    {submission.status === 'graded' ? 'View/Edit' : 'Grade'}
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
        title="Grade Submission"
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
                <label className="block text-sm font-semibold mb-2">Student Answers</label>
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                  {assessmentData.questions.map((q: any, idx: number) => {
                    const ans = selectedSubmission.answers[idx];
                    const isMCQ = q.type !== 'long_answer';
                    const isCorrect = isMCQ && String(ans) === String(q.correct);
                    
                    return (
                      <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">Q{idx + 1}</Badge>
                          <Badge variant="secondary" className="text-xs">{isMCQ ? 'MCQ' : 'Long Answer'} ({q.points} pts)</Badge>
                          {isMCQ && (
                            <Badge variant={isCorrect ? 'success' : 'danger'} className="ml-auto">
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          )}
                        </div>
                        <p className="font-semibold text-sm mb-3">{q.question}</p>
                        
                        {isMCQ ? (
                          <div className="space-y-1 mt-2">
                            {q.options.map((opt: string, optIdx: number) => (
                              <div key={optIdx} className={`p-2 rounded text-xs flex items-center gap-2 ${
                                String(optIdx) === String(q.correct) ? 'bg-green-100 font-bold border border-green-200' :
                                String(ans) === String(optIdx) ? 'bg-red-100 border border-red-200' : 'bg-white border border-gray-200'
                              }`}>
                                <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center border text-[10px]">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                {opt}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg">
                            <p className="text-xs text-[#5A5A6E] mb-1 font-semibold">Student Answer:</p>
                            <p className="text-sm whitespace-pre-wrap">{ans || <span className="text-gray-400 italic">No answer provided</span>}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Grading fields */}
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Score (%)"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                min="0"
                max="100"
              />
              <div className="space-y-1">
                <label className="block text-sm font-semibold">Result</label>
                <select
                  value={passed ? 'pass' : 'fail'}
                  onChange={(e) => setPassed(e.target.value === 'pass')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                >
                  <option value="fail">Not Passed</option>
                  <option value="pass">Passed</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-semibold">Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                placeholder="Provide feedback to the student..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" onClick={() => setIsGradingModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={submitGrade} loading={gradeMutation.isPending} className="flex-1">
                {selectedSubmission.status === 'graded' ? 'Update Grade' : 'Submit Grade'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}