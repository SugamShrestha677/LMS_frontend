import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/lib/services/course.service';
import { toast } from 'react-hot-toast';

// ==================== COURSES ====================
export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getCourses(),
  });
};

export const useCourse = (id: number) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => courseService.getCourse(id),
    enabled: !!id,
  });
};

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseData: any) => courseService.createCourse(courseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course created successfully');
    },
    onError: (error: any) => {
      const fieldErrors = error.response?.data;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstError = Object.values(fieldErrors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : (fieldErrors.message || 'Failed to create course');
        toast.error(errorMessage);
      } else {
        toast.error('Failed to create course');
      }
    },
  });
};

export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => courseService.updateCourse(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.id] });
      toast.success('Course updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update course');
    },
  });
};

export const usePublishCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => courseService.publishCourse(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses', id] });
      toast.success('Course published');
    },
  });
};

// ==================== MODULES ====================
export const useModules = (courseId: number) => {
  return useQuery({
    queryKey: ['courses', courseId, 'modules'],
    queryFn: () => courseService.getModules(courseId),
    enabled: !!courseId,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: any }) =>
      courseService.createModule(courseId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] });
      toast.success('Module created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create module');
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, moduleId, data }: { courseId: number; moduleId: number; data: any }) =>
      courseService.updateModule(courseId, moduleId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'modules'] });
      toast.success('Module updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update module');
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, moduleId }: { courseId: number; moduleId: number }) =>
      courseService.deleteModule(courseId, moduleId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'modules'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] });
      toast.success('Module deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete module');
    },
  });
};

// ==================== MODULE CONTENTS ====================
export const useModuleContents = (courseId: number, moduleId: number) => {
  return useQuery({
    queryKey: ['courses', courseId, 'modules', moduleId, 'contents'],
    queryFn: () => courseService.getModuleContents(courseId, moduleId),
    enabled: !!courseId && !!moduleId,
  });
};

export const useCreateModuleContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, moduleId, data }: { courseId: number; moduleId: number; data: any }) =>
      courseService.createModuleContent(courseId, moduleId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['courses', variables.courseId, 'modules', variables.moduleId, 'contents']
      });
      toast.success('Content added successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to add content');
    },
  });
};

export const useUpdateModuleContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, moduleId, contentId, data }: {
      courseId: number; moduleId: number; contentId: number; data: any
    }) => courseService.updateModuleContent(courseId, moduleId, contentId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['courses', variables.courseId, 'modules', variables.moduleId, 'contents']
      });
      toast.success('Content updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update content');
    },
  });
};

export const useDeleteModuleContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, moduleId, contentId }: {
      courseId: number; moduleId: number; contentId: number
    }) => courseService.deleteModuleContent(courseId, moduleId, contentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['courses', variables.courseId, 'modules', variables.moduleId, 'contents']
      });
      toast.success('Content deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete content');
    },
  });
};

// ==================== ANNOUNCEMENTS ====================
export const useAnnouncements = (courseId: number) => {
  return useQuery({
    queryKey: ['courses', courseId, 'announcements'],
    queryFn: () => courseService.getAnnouncements(courseId),
    enabled: !!courseId,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: any }) =>
      courseService.createAnnouncement(courseId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'announcements'] });
      toast.success('Announcement created');
    },
    onError: (error: any) => {
      const fieldErrors = error.response?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstError = Object.values(fieldErrors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : (fieldErrors.message || 'Failed to create announcement');
        toast.error(errorMessage);
      } else {
        const message = error.response?.data?.message || 'Failed to create announcement';
        toast.error(message);
      }
    },
  });
};

export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, announcementId }: { courseId: number; announcementId: number }) =>
      courseService.deleteAnnouncement(courseId, announcementId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'announcements'] });
      toast.success('Announcement deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete announcement');
    },
  });
};

// ==================== ASSESSMENTS ====================
export const useAssessments = (courseId: number) => {
  return useQuery({
    queryKey: ['courses', courseId, 'assessments'],
    queryFn: () => courseService.getAssessments(courseId),
    enabled: !!courseId,
  });
};

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: any }) =>
      courseService.createAssessment(courseId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'assessments'] });
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId] });
      toast.success('Assessment created');
    },
    onError: (error: any) => {
      toast.error('Failed to create assessment');
    },
  });
};

export const useUpdateAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, assessmentId, data }: {
      courseId: number; assessmentId: number; data: any
    }) => courseService.updateAssessment(courseId, assessmentId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'assessments'] });
      toast.success('Assessment updated');
    },
    onError: (error: any) => {
      toast.error('Failed to update assessment');
    },
  });
};

export const useDeleteAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, assessmentId }: { courseId: number; assessmentId: number }) =>
      courseService.deleteAssessment(courseId, assessmentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'assessments'] });
      toast.success('Assessment deleted');
    },
    onError: (error: any) => {
      toast.error('Failed to delete assessment');
    },
  });
};

// ==================== STUDENT ASSESSMENTS ====================
export const useStudentAssessments = () => {
  return useQuery({
    queryKey: ['student-assessments'],
    queryFn: () => courseService.getStudentAssessments(),
  });
};

export const useSubmitAssessment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => courseService.submitAssessment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-assessments'] });
      toast.success('Assessment submitted!');
    },
    onError: (error: any) => {
      toast.error('Failed to submit assessment');
    },
  });
};

// ==================== RESOURCES ====================
export const useCourseResources = (id: number) => {
  return useQuery({
    queryKey: ['courses', id, 'resources'],
    queryFn: () => courseService.getCourseResources(id),
    enabled: !!id,
  });
};

export const useCreateCourseResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: any }) => {
      const isFormData = data instanceof FormData;
      
      // If file is present, use FormData
      if (data.file_upload || data instanceof FormData) {
        const formData = data instanceof FormData ? data : new FormData();
        
        if (!(data instanceof FormData)) {
          formData.append('title', data.title);
          if (data.description) formData.append('description', data.description);
          if (data.external_link) formData.append('external_link', data.external_link);
          if (data.module_id) formData.append('module_id', String(data.module_id));
          if (data.file_upload) formData.append('file_upload', data.file_upload);
        }
        
        return courseService.createCourseResource(courseId, formData);
      }
      
      // Otherwise send as JSON
      return courseService.createCourseResourceJson(courseId, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'resources'] });
      toast.success('Resource added');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.errors?.error || 
                     error?.response?.data?.message || 
                     'Failed to add resource';
      toast.error(message);
    },
  });
};

export const useDeleteCourseResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, resourceId }: { courseId: number; resourceId: number }) =>
      courseService.deleteCourseResource(courseId, resourceId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'resources'] });
      toast.success('Resource removed');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to remove resource';
      toast.error(message);
    },
  });
};

// ==================== SCORM ====================
export const useUploadScorm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) => courseService.uploadScorm(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('SCORM upload started');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'SCORM upload failed';
      toast.error(message);
    },
  });
};

export const useScormStatus = (id: number, enabled = true) => {
  return useQuery({
    queryKey: ['courses', id, 'scorm-status'],
    queryFn: () => courseService.getScormStatus(id),
    enabled,
    refetchInterval: enabled ? 5000 : false,
  });
};

// ==================== ENROLLMENTS & CERTIFICATES ====================
export const useEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: () => courseService.getEnrollments(),
  });
};

export const useCertificates = () => {
  return useQuery({
    queryKey: ['certificates'],
    queryFn: () => courseService.getCertificates(),
  });
};

export const useGenerateCertificate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: number) => courseService.generateCertificate(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      toast.success('Certificate generated!');
    },
    onError: (error: any) => {
      toast.error('Failed to generate certificate');
    },
  });
};

// ==================== REVIEWS ====================
export const useReviews = (courseId: number) => {
  return useQuery({
    queryKey: ['courses', courseId, 'reviews'],
    queryFn: () => courseService.getReviews(courseId),
    enabled: !!courseId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: any }) =>
      courseService.createReview(courseId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'reviews'] });
      toast.success('Review submitted!');
    },
    onError: (error: any) => {
      toast.error('Failed to submit review');
    },
  });
};

// ==================== CATEGORIES ====================
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => courseService.getCategories(),
  });
};

// ==================== STUDENT SPECIFIC ====================
export const useStudentCourses = () => {
  return useQuery({
    queryKey: ['student-courses'],
    queryFn: () => courseService.getStudentCourses(),
  });
};

export const useStudentEnrolledCourses = () => {
  return useQuery({
    queryKey: ['student-enrolled-courses'],
    queryFn: () => courseService.getStudentEnrolledCourses(),
  });
};

export const useStudentCourseDetail = (courseId: number) => {
  return useQuery({
    queryKey: ['student-course-detail', courseId],
    queryFn: () => courseService.getStudentCourseDetail(courseId),
    enabled: !!courseId,
  });
};

export const useEnrollStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId: number) => courseService.enrollStudent(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-enrolled-courses'] });
      queryClient.invalidateQueries({ queryKey: ['student-courses'] });
      toast.success('Enrolled successfully!');
    },
    onError: (error: any) => {
      toast.error('Failed to enroll');
    },
  });
};

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: () => courseService.getStudentDashboard(),
  });
};

// ==================== PAYMENTS ====================
export const usePayments = () => {
  return useQuery({
    queryKey: ['payments'],
    queryFn: () => courseService.getPayments(),
  });
};

export const useSubmitPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => courseService.submitPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment submitted for verification');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to submit payment';
      toast.error(message);
    },
  });
};

export const useConfirmPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: number) => courseService.confirmPayment(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['student-enrolled-courses'] });
      toast.success('Payment confirmed and student enrolled');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to confirm payment';
      toast.error(message);
    },
  });
};

export const useRejectPayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, reason }: { paymentId: number; reason: string }) =>
      courseService.rejectPayment(paymentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('Payment rejected');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to reject payment';
      toast.error(message);
    },
  });
};