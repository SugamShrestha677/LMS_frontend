'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Clock, Upload, File, X, Download, Eye, 
  AlertTriangle, Cloud, CheckCircle, XCircle
} from 'lucide-react';
import { toast } from 'sonner';
import api from '@/lib/services/api';
import { format } from 'date-fns';

export default function AssignmentSubmissionPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = Number(params.assessmentId);
  const courseId = searchParams.get('courseId') || 1;
  
  const attemptIdParam = searchParams.get('attempt');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attemptId, setAttemptId] = useState<number | null>(attemptIdParam ? Number(attemptIdParam) : null);
  const reviewMode = !!attemptIdParam;

  const { data: attemptData } = useQuery({
    queryKey: ['attempt', attemptIdParam],
    queryFn: async () => {
      const response = await api.get(`/student-assessments/${attemptIdParam}/`);
      return response.data?.data || response.data;
    },
    enabled: !!attemptIdParam,
  });

  const { data: assessmentData, isLoading } = useQuery({
    queryKey: ['assessment', assessmentId, courseId],
    queryFn: async () => {
      const response = await api.get(`/courses/${courseId}/assessments/${assessmentId}/`);
      return response.data?.data || response.data;
    },
    enabled: !!assessmentId,
  });

  const assessment = assessmentData;

  // Check if submission is allowed
  const isWithinDeadline = () => {
    if (!assessment) return false;
    const now = new Date();
    
    if (assessment.end_datetime) {
      const deadline = new Date(assessment.end_datetime);
      if (assessment.allow_late_submission && assessment.late_submission_deadline) {
        return now <= new Date(assessment.late_submission_deadline);
      }
      return now <= deadline;
    }
    return true;
  };

  const getAllowedFileTypes = () => {
    if (!assessment?.allowed_file_types) return [];
    return assessment.allowed_file_types.split(',').map((t: string) => t.trim());
  };

  const isFileTypeAllowed = (fileName: string) => {
    const allowed = getAllowedFileTypes();
    if (allowed.length === 0) return true;
    
    const ext = fileName.split('.').pop()?.toLowerCase();
    return allowed.includes(ext || '');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Check file size
    const maxSize = (assessment?.max_file_size_mb || 10) * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      toast.error(`File too large. Maximum size: ${assessment?.max_file_size_mb || 10}MB`);
      return;
    }

    // Check file type
    if (!isFileTypeAllowed(selectedFile.name)) {
      toast.error(`File type not allowed. Allowed: ${getAllowedFileTypes().join(', ')}`);
      return;
    }

    setFile(selectedFile);
  };

  // Create attempt
  useEffect(() => {
    if (assessment && !attemptId && !reviewMode) {
      api.post('/student-assessments/', {
        assessment: assessmentId,
        status: 'started',
      }).then((response) => {
        setAttemptId(response.data?.data?.id || response.data?.id);
      }).catch((error: any) => {
        if (error.response?.status === 400) {
          toast.error(error.response?.data?.error || 'You cannot start this assignment');
          router.back();
        }
      });
    }
  }, [assessment, assessmentId, router]);

  const handleSubmit = async () => {
    if (!file && !text) {
      toast.error('Please upload a file or enter text');
      return;
    }

    setIsUploading(true);

    try {
      let submissionFile = null;

      // Upload file to Cloudinary if file is selected
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'lms_assignments'); // Your Cloudinary preset
        formData.append('folder', `assignments/${assessmentId}`);

        const cloudResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          { method: 'POST', body: formData }
        );
        const cloudData = await cloudResponse.json();
        submissionFile = cloudData.secure_url;
      }

      // Submit to backend
      await api.post(`/student-assessments/${attemptId}/submit/`, {
        submission_file: submissionFile,
        submission_text: text,
        status: 'submitted',
      });

      setSubmitted(true);
      toast.success('Assignment submitted successfully!');
      
      setTimeout(() => {
        router.push('/student/courses');
      }, 2000);
    } catch (error) {
      toast.error('Failed to submit assignment');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#0A5C4A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-12">
        <Card className="p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cloud size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#1E1E2A] mb-2">Assignment Submitted!</h2>
          <p className="text-[#5A5A6E] mb-6">Your assignment has been submitted for grading.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = `/student/assessments/${assessmentId}/assignment?attempt=${attemptId}&courseId=${courseId}`}>
              View Submission
            </Button>
            <Button variant="outline" onClick={() => router.push('/student/courses')}>
              Back to Courses
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (reviewMode && attemptData) {
    return (
      <div className="max-w-3xl mx-auto p-4 py-8">
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-[#1E1E2A]">{assessment?.title || attemptData.assessment_title}</h1>
            <Badge variant={attemptData.status === 'graded' ? 'success' : 'warning'}>
              {attemptData.status}
            </Badge>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-[#5A5A6E] mb-2 font-semibold">Your Submission:</p>
            {attemptData.submission_file && (
              <a 
                href={attemptData.submission_file} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-[#0A5C4A] font-semibold p-3 bg-white border border-gray-200 rounded-lg w-fit mb-3 hover:bg-gray-50"
              >
                <Download size={18} /> Download Submitted File
              </a>
            )}
            {attemptData.submission_text && (
              <div className="p-3 bg-white border border-gray-200 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">{attemptData.submission_text}</p>
              </div>
            )}
            {!attemptData.submission_file && !attemptData.submission_text && (
              <p className="text-sm italic text-gray-500">No content submitted.</p>
            )}
          </div>

          {attemptData.status === 'graded' && (
            <div className={`rounded-xl p-6 ${attemptData.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <h3 className={`font-bold mb-2 flex items-center gap-2 ${attemptData.passed ? 'text-green-800' : 'text-red-800'}`}>
                {attemptData.passed ? <CheckCircle size={20} /> : <XCircle size={20} />}
                Grade Result
              </h3>
              <p className={`text-2xl font-black mb-3 ${attemptData.passed ? 'text-green-600' : 'text-red-600'}`}>
                Score: {attemptData.score}%
              </p>
              {attemptData.feedback && (
                <div>
                  <p className="text-xs font-semibold mb-1 opacity-70">Tutor Feedback:</p>
                  <p className="text-sm">{attemptData.feedback}</p>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <Button onClick={() => router.push('/student/assessments')} variant="outline">
              Back to Assessments
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!isWithinDeadline() && !reviewMode) {
    return (
      <div className="max-w-2xl mx-auto p-4 py-12">
        <Card className="p-12 text-center">
          <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-[#1E1E2A] mb-2">Submission Closed</h2>
          <p className="text-[#5A5A6E]">The deadline for this assignment has passed.</p>
          {assessment?.end_datetime && (
            <p className="text-sm text-[#5A5A6E] mt-2">
              Deadline was: {format(new Date(assessment.end_datetime), 'MMM d, yyyy h:mm a')}
            </p>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 py-8">
      <Card className="p-6 md:p-8">
        <h1 className="text-2xl font-black text-[#1E1E2A] mb-2">{assessment?.title}</h1>
        <p className="text-[#5A5A6E] mb-6">{assessment?.description}</p>

        {/* Deadline info */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="text-xs text-[#5A5A6E] mb-1">Start</p>
            <p className="font-semibold text-sm">
              {assessment?.start_datetime 
                ? format(new Date(assessment.start_datetime), 'MMM d, yyyy h:mm a')
                : 'Immediate'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5A5A6E] mb-1">Deadline</p>
            <p className="font-semibold text-sm">
              {assessment?.end_datetime 
                ? format(new Date(assessment.end_datetime), 'MMM d, yyyy h:mm a')
                : 'No deadline'}
            </p>
          </div>
          <div>
            <p className="text-xs text-[#5A5A6E] mb-1">Max Score</p>
            <p className="font-semibold text-sm">{assessment?.max_score}</p>
          </div>
          <div>
            <p className="text-xs text-[#5A5A6E] mb-1">Max File Size</p>
            <p className="font-semibold text-sm">{assessment?.max_file_size_mb || 10} MB</p>
          </div>
        </div>

        {/* Allowed file types */}
        {getAllowedFileTypes().length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Allowed file types: {getAllowedFileTypes().join(', ')}
            </p>
          </div>
        )}

        {/* File upload */}
        {(assessment?.submission_type === 'file' || assessment?.submission_type === 'multiple') && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Upload File</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0A5C4A] transition-colors">
              {file ? (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <File size={24} className="text-[#0A5C4A]" />
                    <div>
                      <p className="font-semibold text-sm">{file.name}</p>
                      <p className="text-xs text-[#5A5A6E]">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700">
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <>
                  <Upload size={40} className="text-gray-400 mx-auto mb-3" />
                  <p className="text-[#5A5A6E] mb-2">Drag and drop or click to upload</p>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept={getAllowedFileTypes().map(t => `.${t}`).join(',')}
                  />
                  <label htmlFor="file-upload">
                    <Button type="button" variant="outline" className="cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                </>
              )}
            </div>
          </div>
        )}

        {/* Text entry */}
        {(assessment?.submission_type === 'text' || assessment?.submission_type === 'multiple') && (
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Your Answer</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={10}
              placeholder="Write your answer here..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#0A5C4A]/20 focus:border-[#0A5C4A] resize-none"
            />
          </div>
        )}

        {/* Late submission warning */}
        {assessment?.end_datetime && new Date() > new Date(assessment.end_datetime) && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-3">
            <AlertTriangle size={20} className="text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              You are submitting after the deadline. 
              {assessment.allow_late_submission ? ' Late submission is accepted.' : ' Late submission may not be accepted.'}
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={isUploading}>
            Submit Assignment
          </Button>
        </div>
      </Card>
    </div>
  );
}