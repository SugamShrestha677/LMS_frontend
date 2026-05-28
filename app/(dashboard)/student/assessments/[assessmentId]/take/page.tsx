'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth-store';
import { useTabSwitchDetection } from '@/lib/hooks/useTabSwitchDetection';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Clock, AlertTriangle, CheckCircle, XCircle, 
  Eye, EyeOff, ArrowLeft, ArrowRight, 
  Timer, Monitor, AlertOctagon, Edit3,
  FileText, Send, ChevronLeft,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import api from '@/lib/services/api';

// ==================== MAIN COMPONENT ====================
export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const assessmentId = Number(params.assessmentId);
  const courseId = searchParams.get('courseId') || 1;
  const attemptParam = searchParams.get('attempt');
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tabWarningCount, setTabWarningCount] = useState(0);
  const [isAutoSubmitted, setIsAutoSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [assessmentEnded, setAssessmentEnded] = useState(false);
  const [attemptData, setAttemptData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date>(new Date());

  // Fetch assessment
  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['assessment', assessmentId, courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/assessments/${assessmentId}/`);
      return response.data?.data || response.data;
    },
    enabled: !!assessmentId,
  });

  const assessment = assessmentData;
  const questions = assessment?.questions || [];
  const isQuiz = assessment?.assessment_type === 'quiz';
  const isExam = assessment?.assessment_type === 'exam';

  const initializeAttempt = useCallback(async () => {
    if (!assessment) return;

    try {
      const response = attemptParam
        ? await api.get(`/student-assessments/${attemptParam}/`)
        : await api.post('/student-assessments/', {
            assessment: assessmentId,
            status: 'in_progress',
          });

      const attempt = response.data?.data || response.data;
      setAttemptId(attempt.id);
      
      // If already submitted or graded, show results/review
      if (attempt.status === 'submitted' || attempt.status === 'graded') {
        setAnswers(attempt.answers || {});
        setReviewMode(true);
        setAttemptData(attempt);
        
        // Show results view ONLY if after deadline for both Quizzes and Exams
        const isAfterDeadline = !assessment?.end_datetime || new Date() >= new Date(assessment.end_datetime);
        
        if (isQuiz || isExam) {
          if (isAfterDeadline) {
            setShowResults(true);
          } else {
            setAssessmentEnded(true); // Shows "Assessment Submitted" message without results
          }
        } else {
          setAssessmentEnded(true);
        }
        setIsInitializing(false);
        return;
      }

      startTimeRef.current = new Date();
      
      // Set timer
      if (assessment?.duration_minutes) {
        setTimeLeft(assessment.duration_minutes * 60);
      }

      setIsInitializing(false);
    } catch (error: any) {
      setIsInitializing(false);
      
      const isAfterDeadline = assessment?.end_datetime && new Date() >= new Date(assessment.end_datetime);
      if (isAfterDeadline) {
        toast.error('This assessment has expired and can no longer be taken.');
      } else {
        toast.error('Failed to access assessment');
      }
      router.back();
    }
  }, [assessment, assessmentId, attemptParam, router, isExam, isQuiz]);

  // Create or hydrate attempt once the assessment is loaded
  useEffect(() => {
    if (!assessment || attemptId || !isInitializing) return;
    initializeAttempt();
  }, [assessment, attemptId, initializeAttempt, isInitializing]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !showResults && !reviewMode && !assessmentEnded) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoSubmit('time_up');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLeft, showResults, reviewMode, assessmentEnded]);

  // Check if assessment end time has passed
  useEffect(() => {
    if (assessment?.end_datetime) {
      const endTime = new Date(assessment.end_datetime).getTime();
      const checkInterval = setInterval(() => {
        if (Date.now() >= endTime && !assessmentEnded) {
          handleAutoSubmit('time_expired');
          setAssessmentEnded(true);
        }
      }, 1000);
      return () => clearInterval(checkInterval);
    }
  }, [assessment, assessmentEnded]);

  // Tab switch detection
  const handleTabSwitch = useCallback(() => {
    setTabWarningCount((prev) => prev + 1);
    const newCount = tabWarningCount + 1;
    
    if (attemptId && assessment?.track_tab_switching) {
      api.post(`/student-assessments/${attemptId}/tab_switch/`)
        .then((response) => {
          const data = response.data?.data || response.data;
          if (data?.auto_submitted) {
            handleAutoSubmit('tab_switch');
          }
        })
        .catch(() => {});
    }

    if (newCount >= (assessment?.max_tab_switches || 3)) {
      handleAutoSubmit('tab_switch');
    } else {
      toast.warning(`Warning ${newCount}/${assessment?.max_tab_switches || 3}: Stay on this page!`);
    }
  }, [attemptId, assessment, tabWarningCount]);

  const handleReturn = useCallback(() => {
    // User returned to the page
  }, []);

  useTabSwitchDetection({
    onTabSwitch: handleTabSwitch,
    onReturn: handleReturn,
    enabled: assessment?.track_tab_switching && !showResults && !reviewMode && !assessmentEnded,
  });

  // Handle answer selection (MCQ)
  const handleMCQAnswer = (questionIndex: number, optionIndex: number) => {
    if (reviewMode || assessmentEnded) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Handle long answer text
  const handleLongAnswer = (questionIndex: number, text: string) => {
    if (reviewMode || assessmentEnded) return;
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: text,
    }));
  };

  // Submit assessment
  const handleSubmit = async () => {
    if (!attemptId) return;
    
    // Confirm submission
    const unanswered = questions.filter((_: any, idx: number) => answers[idx] === undefined || answers[idx] === '');
    if (unanswered.length > 0) {
      const confirm = window.confirm(
        `You have ${unanswered.length} unanswered question(s). Are you sure you want to submit?`
      );
      if (!confirm) return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post(`/student-assessments/${attemptId}/submit/`, {
        answers,
      });
      const updatedAttempt = response.data?.data || response.data;
      setAttemptData(updatedAttempt);

      if (isQuiz) {
        // Quiz: Show results after end time or immediately
        const canView = !assessment.end_datetime || new Date() >= new Date(assessment.end_datetime);
        if (canView) {
          setShowResults(true);
          setReviewMode(true);
          toast.success('Quiz submitted! View your results below.');
        } else {
          toast.success('Quiz submitted! Results will be available after the deadline.');
          router.push('/student/courses');
        }
      } else if (isExam) {
        // Exam: Show submitted answers immediately
        setShowResults(true);
        setReviewMode(true);
        toast.success('Exam submitted! Your answers are shown below and awaiting instructor grading.');
      }
    } catch (error) {
      toast.error('Failed to submit assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-submit
  const handleAutoSubmit = async (reason: string) => {
    if (!attemptId || isAutoSubmitted) return;
    setIsAutoSubmitted(true);
    
    try {
      const response = await api.post(`/student-assessments/${attemptId}/submit/`, {
        answers,
        auto_submitted: true,
        reason,
      });
      const updatedAttempt = response.data?.data || response.data;
      setAttemptData(updatedAttempt);
      
      setReviewMode(true);
      setAssessmentEnded(true);
      
      if (isQuiz) {
        const canView = !assessment.end_datetime || new Date() >= new Date(assessment.end_datetime);
        if (canView) {
          setShowResults(true);
        }
      } else if (isExam) {
        setShowResults(true);
      }
      
      const messages: Record<string, string> = {
        time_up: 'Time is up! Your assessment has been auto-submitted.',
        time_expired: 'Deadline reached. Assessment auto-submitted.',
        tab_switch: 'Assessment auto-submitted due to excessive tab switching.',
      };
      
      toast.warning(messages[reason] || 'Assessment auto-submitted.');
    } catch (error) {
      toast.error('Auto-submit failed');
    }
  };

  // Navigation
  const goToNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getAnsweredCount = () => {
    return questions.filter((_: any, idx: number) => 
      answers[idx] !== undefined && answers[idx] !== ''
    ).length;
  };

  if (isLoading) {
    return <AssessmentTakeSkeleton />;
  }

  if (isInitializing) {
    return <AssessmentTakeSkeleton />;
  }

  if (!assessment) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Assessment not found</h2>
        <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isMCQ = question?.type !== 'long_answer';
  const isLongAnswer = question?.type === 'long_answer';

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      {!showResults && (
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900 line-clamp-1">{assessment?.title}</h1>
              {!showResults && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Q {currentQuestion + 1}/{questions.length}</span>
                  <span>•</span>
                  <span>{getAnsweredCount()} answered</span>
                  <span>•</span>
                  <span className="capitalize">{assessment?.assessment_type}</span>
                </div>
              )}
            </div>
          </div>

          {!showResults && (
            <div className="flex items-center gap-4">
              {assessment?.is_proctored && (
                <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 rounded text-[10px] font-bold uppercase tracking-wider">
                  <Shield size={12} />
                  Proctored
                </div>
              )}
              
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold ${
                timeLeft < 300 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-700'
              }`}>
                <Timer size={18} />
                {formatTime(timeLeft)}
              </div>

              <Button
                size="sm"
                onClick={handleSubmit}
                loading={isSubmitting}
                className="hidden md:flex"
              >
                Submit
              </Button>
            </div>
          )}
        </div>

        {/* Progress Bar - Only during assessment */}
        {!showResults && (
          <div className="h-1 bg-gray-100 w-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="h-full bg-[#0A5C4A]"
            />
          </div>
        )}
      </div>
      )}

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4 py-8">
        {showResults ? (
          <ResultsView 
            assessment={assessment}
            answers={answers}
            attempt={attemptData}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Question navigation sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <Card className="p-4 sticky top-28">
                <h3 className="font-semibold text-sm mb-3">Questions</h3>
                <div className="grid grid-cols-4 gap-1.5">
                  {questions.map((q: any, idx: number) => {
                    const isAnswered = answers[idx] !== undefined && answers[idx] !== '';
                    const isCurrent = idx === currentQuestion;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => goToQuestion(idx)}
                        className={`w-full aspect-square rounded-lg text-xs font-bold transition-all flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#0A5C4A] text-white shadow-md'
                            : isAnswered
                            ? 'bg-[#0A5C4A]/20 text-[#0A5C4A] ring-1 ring-[#0A5C4A]/30'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={`Q${idx + 1}${q.type === 'long_answer' ? ' (Long Answer)' : ''}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#5A5A6E]">
                    <div className="w-3 h-3 rounded bg-[#0A5C4A]" />
                    <span>Current</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5A5A6E]">
                    <div className="w-3 h-3 rounded bg-[#0A5C4A]/20 ring-1 ring-[#0A5C4A]/30" />
                    <span>Answered</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5A5A6E]">
                    <div className="w-3 h-3 rounded bg-gray-100" />
                    <span>Unanswered</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Question area */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="p-6 md:p-8 shadow-lg">
                    {/* Question header */}
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="primary" className="text-xs">
                            Question {currentQuestion + 1}
                          </Badge>
                          {isMCQ && (
                            <Badge variant="outline" className="text-xs">Multiple Choice</Badge>
                          )}
                          {isLongAnswer && (
                            <Badge variant="secondary" className="text-xs flex items-center gap-1">
                              <Edit3 size={10} /> Long Answer
                            </Badge>
                          )}
                        </div>
                        <h2 className="text-xl font-bold text-[#1E1E2A]">
                          {question?.question}
                        </h2>
                        {question?.points && (
                          <p className="text-sm text-[#5A5A6E] mt-1 font-medium">
                            {question.points} point{question.points > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* MCQ Options */}
                    {isMCQ && question?.options && (
                      <div className="space-y-3">
                        {question.options.map((option: string, optIdx: number) => (
                          <button
                            key={optIdx}
                            onClick={() => handleMCQAnswer(currentQuestion, optIdx)}
                            disabled={reviewMode || assessmentEnded}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                              answers[currentQuestion] === optIdx
                                ? 'border-[#0A5C4A] bg-[#0A5C4A]/5 text-[#0A5C4A] shadow-md'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[#1E1E2A]'
                            } ${(reviewMode || assessmentEnded) ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                                answers[currentQuestion] === optIdx
                                  ? 'bg-[#0A5C4A] text-white'
                                  : 'bg-gray-100 text-gray-500'
                              }`}>
                                {String.fromCharCode(65 + optIdx)}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Long Answer */}
                    {isLongAnswer && (
                      <div className="space-y-3">
                        {question?.word_limit && (
                          <div className="flex items-center gap-2 text-sm text-[#5A5A6E] mb-2">
                            <FileText size={14} />
                            <span>Word limit: {question.word_limit} words</span>
                          </div>
                        )}
                        <textarea
                          value={answers[currentQuestion] || ''}
                          onChange={(e) => handleLongAnswer(currentQuestion, e.target.value)}
                          rows={10}
                          placeholder="Write your answer here..."
                          disabled={reviewMode || assessmentEnded}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] resize-none disabled:bg-gray-100 disabled:cursor-not-allowed text-[#1E1E2A]"
                        />
                        {question?.word_limit && (
                          <p className="text-xs text-[#5A5A6E] text-right">
                            {String(answers[currentQuestion] || '').split(/\s+/).filter(Boolean).length} / {question.word_limit} words
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>
              </AnimatePresence>

              {/* Bottom navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={goToPrevious}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft size={16} className="mr-1" /> Previous
                </Button>

                <div className="flex items-center gap-3">
                  {/* Mobile question indicator */}
                  <span className="lg:hidden text-sm font-medium text-[#5A5A6E]">
                    {currentQuestion + 1}/{questions.length}
                  </span>
                  
                  {/* Quick jump on mobile */}
                  <select
                    value={currentQuestion}
                    onChange={(e) => goToQuestion(Number(e.target.value))}
                    className="lg:hidden px-3 py-2 rounded-lg border border-gray-200 text-sm bg-white"
                  >
                    {questions.map((_: any, idx: number) => (
                      <option key={idx} value={idx}>
                        Q{idx + 1} {answers[idx] !== undefined ? '✓' : '○'}
                      </option>
                    ))}
                  </select>
                </div>

                {currentQuestion < questions.length - 1 ? (
                  <Button size="lg" onClick={goToNext}>
                    Next <ArrowRight size={16} className="ml-1" />
                  </Button>
                ) : (
                  <Button 
                    size="lg"
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={reviewMode || assessmentEnded}
                    className="shadow-lg bg-[#0A5C4A] hover:bg-[#0A5C4A]/90"
                  >
                    <Send size={16} className="mr-1" /> Submit Assessment
                  </Button>
                )}
              </div>

              {/* Warning messages */}
              {tabWarningCount >= 1 && tabWarningCount < (assessment?.max_tab_switches || 3) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3"
                >
                  <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-yellow-800 text-sm">Warning!</p>
                    <p className="text-sm text-yellow-700">
                      Tab switching detected ({tabWarningCount}/{assessment?.max_tab_switches || 3}). 
                      Stay on this page to avoid auto-submission.
                    </p>
                  </div>
                </motion.div>
              )}

              {assessmentEnded && !showResults && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 p-6 bg-gray-100 rounded-xl text-center"
                >
                  <Clock size={32} className="text-gray-400 mx-auto mb-3" />
                  <h3 className="font-bold text-lg text-[#1E1E2A]">Time is up!</h3>
                  <p className="text-[#5A5A6E] mt-1">
                    Your assessment has been auto-submitted.
                    {isExam && ' Your instructor will grade your answers.'}
                  </p>
                  <Button onClick={() => router.push('/student/courses')} className="mt-4">
                    Back to Courses
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== RESULTS VIEW COMPONENT ====================
function ResultsView({ assessment, answers, attempt }: {
  assessment: any;
  answers: Record<string, any>;
  attempt: any;
}) {
  const questions = assessment?.questions || [];
  const router = useRouter();
  const [showCorrect, setShowCorrect] = useState(true);

  const calculateScore = () => {
    let earned = 0;
    let total = 0;

    questions.forEach((q: any, idx: number) => {
      const points = q.points || 10;
      total += points;
      
      const rawAns = answers[idx];
      const studentAnsValue = typeof rawAns === 'object' ? rawAns?.value : rawAns;

      // Only MCQ can be auto-graded
      if (q.type !== 'long_answer') {
        if (String(studentAnsValue) === String(q.correct)) {
          earned += points;
        }
      } else {
        // For long answer, use the grade if it exists
        if (typeof rawAns === 'object' && rawAns.grade !== undefined) {
          earned += Number(rawAns.grade);
        }
      }
    });

    return { earned, total, percentage: total > 0 ? Math.round((earned / total) * 100) : 0 };
  };

  const localResult = calculateScore();
  const hasOfficialScore = attempt?.score !== null && attempt?.score !== undefined;
  
  // Backend score is usually a percentage (0-100)
  const percentage = hasOfficialScore ? Math.round(Number(attempt.score)) : localResult.percentage;
  const total = localResult.total;
  // Calculate earned points from percentage if official, otherwise use local points
  const earned = hasOfficialScore ? Math.round((percentage / 100) * total) : localResult.earned;
  const passed = percentage >= (assessment?.passing_score || 60);
  const isPendingGrading = assessment.assessment_type === 'exam' && attempt?.status === 'submitted';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <button
        onClick={() => router.push('/student/assessments')}
        className="flex items-center gap-2 text-[#5A5A6E] hover:text-[#0A5C4A] font-bold transition-colors mb-4 group"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        Back to Assessments
      </button>
      {/* Score summary */}
      <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-[#0A5C4A]/5 to-transparent border-2 border-[#0A5C4A]/10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className={`w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center ${
            passed ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          {passed ? (
            <CheckCircle size={56} className="text-green-600" />
          ) : (
            <XCircle size={56} className="text-red-600" />
          )}
        </motion.div>
        
        <h2 className="text-3xl font-black text-[#1E1E2A] mb-3">
          {isPendingGrading ? 'Assessment Submitted!' : (passed ? 'Congratulations! 🎉' : 'Keep Trying! 💪')}
        </h2>
        
        <div className="text-lg mb-2">
          <span className="font-bold text-[#0A5C4A]">
            {isPendingGrading ? 'Pending Instructor Grading' : `Score: ${earned}/${total} (${percentage}%)`}
          </span>
        </div>
        
        {!isPendingGrading && (
          <p className="text-[#5A5A6E] mb-6">
            Passing score: {assessment?.passing_score}%
            {passed ? ' - You passed!' : ' - You did not pass'}
          </p>
        )}

        {assessment.assessment_type === 'exam' && (
          <div className="p-4 bg-purple-50 rounded-xl inline-block mt-4">
            <p className="text-sm text-purple-700">
              <Edit3 size={14} className="inline mr-1" />
              This is an exam. Long answer questions require manual grading by your instructor.
              {isPendingGrading ? ' Your score will be available after grading.' : ' Final score may change after instructor review.'}
            </p>
          </div>
        )}
      </Card>

      {(attempt?.feedback || attempt?.feedback_at || attempt?.feedback_by) && (
        <Card className="p-6 border-2 border-[#0A5C4A]/15 bg-[#0A5C4A]/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-[#0A5C4A]">Instructor Feedback</h3>
              <p className="text-sm text-[#5A5A6E] mt-1">
                Private feedback from your instructor for this attempt.
              </p>
            </div>
            <Badge variant="outline" className="shrink-0">
              Visible only to you
            </Badge>
          </div>

          <div className="mt-4 space-y-3">
            {attempt?.feedback ? (
              <p className="text-[#1E1E2A] leading-relaxed whitespace-pre-wrap italic">
                {attempt.feedback}
              </p>
            ) : (
              <p className="text-sm text-gray-500 italic">No written feedback yet.</p>
            )}

            {(attempt?.feedback_by || attempt?.feedback_at) && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#5A5A6E] pt-2 border-t border-[#0A5C4A]/10">
                {attempt?.feedback_by && (
                  <span>
                    From: {attempt.feedback_by_name || 'Instructor'}
                  </span>
                )}
                {attempt?.feedback_by && attempt?.feedback_at && <span>•</span>}
                {attempt?.feedback_at && (
                  <span>
                    Sent {new Date(attempt.feedback_at).toLocaleString()}
                  </span>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Question review */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl">Review Answers</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCorrect(!showCorrect)}
          >
            {showCorrect ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
            {showCorrect ? 'Hide Answers' : 'Show Answers'}
          </Button>
        </div>

        {questions.map((q: any, idx: number) => {
          const rawAns = answers[idx];
          const studentAnsValue = typeof rawAns === 'object' ? rawAns?.value : rawAns;
          const isMCQ = q.type !== 'long_answer';
          const isCorrect = isMCQ && String(studentAnsValue) === String(q.correct);
          const isUnanswered = answers[idx] === undefined || answers[idx] === '';
          
          return (
            <Card key={idx} className={`p-6 border-l-4 ${
              isMCQ 
                ? (isCorrect ? 'border-l-green-500' : 'border-l-red-500')
                : 'border-l-purple-500'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Q{idx + 1}</Badge>
                    {isMCQ ? (
                      <Badge variant="primary" className="text-xs">MCQ</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Long Answer</Badge>
                    )}
                    <span className="text-sm text-[#5A5A6E]">{q.points} points</span>
                  </div>
                  <p className="font-semibold text-[#1E1E2A]">{q.question}</p>
                </div>
                
                {isMCQ && (
                  isCorrect ? (
                    <CheckCircle size={24} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle size={24} className="text-red-500 flex-shrink-0" />
                  )
                )}
                
                {!isMCQ && (
                  <Badge variant="secondary" className="flex-shrink-0">
                    Manual Grading
                  </Badge>
                )}
              </div>

              {/* MCQ Options Review */}
              {isMCQ && q.options && (
                <div className="space-y-1.5 mt-3">
                  {q.options.map((opt: string, optIdx: number) => {
                    const studentAns = typeof answers[idx] === 'object' ? answers[idx]?.value : answers[idx];
                    const isUserAnswer = String(studentAns) === String(optIdx);
                    const isCorrectAnswer = showCorrect && String(optIdx) === String(q.correct);
                    
                    return (
                      <div key={optIdx} className={`p-3 rounded-lg text-sm flex items-center gap-3 ${
                        isCorrectAnswer
                          ? 'bg-green-50 border border-green-200 font-semibold'
                          : isUserAnswer && !isCorrect
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-gray-50 border border-gray-100'
                      }`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isCorrectAnswer
                            ? 'bg-green-500 text-white'
                            : isUserAnswer && !isCorrect
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                        {isCorrectAnswer && (
                          <span className="text-green-600 text-xs font-bold ml-auto">✓ Correct</span>
                        )}
                        {isUserAnswer && !isCorrect && (
                          <span className="text-red-600 text-xs font-bold ml-auto">✗ Your Answer</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Long Answer Review */}
              {!isMCQ && (
                <div className="mt-3 space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs text-[#5A5A6E] mb-2 font-semibold uppercase tracking-wider">Your Answer:</p>
                    <p className="text-sm whitespace-pre-wrap text-[#1E1E2A]">
                      {(typeof answers[idx] === 'object' ? answers[idx]?.value : answers[idx]) || 
                       <span className="text-gray-400 italic">No answer provided</span>}
                    </p>
                  </div>
                  
                  {typeof answers[idx] === 'object' && answers[idx].grade !== undefined && (
                    <div className="flex items-center justify-between px-4 py-2 bg-purple-50 rounded-lg border border-purple-100">
                      <span className="text-xs font-bold text-purple-700">Instructor Grade:</span>
                      <span className="text-sm font-black text-purple-700">{answers[idx].grade} / {q.points || 10} Points</span>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
        <Button variant="outline" onClick={() => window.location.href = '/student/courses'} size="lg">
          Back to Courses
        </Button>
        <Button onClick={() => window.location.href = '/student/assessments'} size="lg">
          View All Assessments
        </Button>
      </div>
    </div>
  );
}

function AssessmentTakeSkeleton() {
  return (
    <div className="max-w-6xl mx-auto p-4 py-8 space-y-6 animate-pulse">
      <Card className="p-6 md:p-8 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            <div className="h-4 w-24 rounded-full bg-gray-200" />
            <div className="h-7 w-3/4 rounded-lg bg-gray-200" />
            <div className="h-4 w-1/2 rounded-full bg-gray-100" />
          </div>
          <div className="hidden md:block h-10 w-28 rounded-xl bg-gray-200" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="hidden lg:block lg:col-span-1 p-4">
          <div className="h-4 w-24 rounded-full bg-gray-200 mb-4" />
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="aspect-square rounded-lg bg-gray-100" />
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-4 p-6 md:p-8 shadow-lg space-y-6">
          <div className="space-y-3">
            <div className="h-4 w-32 rounded-full bg-gray-200" />
            <div className="h-7 w-11/12 rounded-lg bg-gray-200" />
            <div className="h-4 w-1/4 rounded-full bg-gray-100" />
          </div>

          <div className="space-y-3">
            <div className="h-14 rounded-xl bg-gray-100" />
            <div className="h-14 rounded-xl bg-gray-100" />
            <div className="h-14 rounded-xl bg-gray-100" />
            <div className="h-14 rounded-xl bg-gray-100" />
          </div>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="h-11 w-32 rounded-xl bg-gray-100" />
            <div className="h-11 w-32 rounded-xl bg-gray-200" />
          </div>
        </Card>
      </div>
    </div>
  );
}