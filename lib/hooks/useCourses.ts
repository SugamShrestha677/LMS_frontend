import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/lib/services/course.service';
import { toast } from 'react-hot-toast';

export const useCourses = () => {
  return useQuery({
    queryKey: ['courses'],
    queryFn: () => courseService.getCourses(),
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => courseService.getCategories(),
  });
};

export const useCourse = (id: number) => {
  return useQuery({
    queryKey: ['courses', id],
    queryFn: () => courseService.getCourse(id),
    enabled: !!id,
  });
};

export const useCourseResources = (id: number) => {
  return useQuery({
    queryKey: ['courses', id, 'resources'],
    queryFn: () => courseService.getCourseResources(id),
    enabled: !!id,
  });
};

export const useEnrollments = () => {
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: () => courseService.getEnrollments(),
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
      const fieldErrors = error.response?.data;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const firstError = Object.values(fieldErrors)[0];
        const errorMessage = Array.isArray(firstError) ? firstError[0] : (fieldErrors.message || 'Failed to update course');
        toast.error(errorMessage);
      } else {
        toast.error('Failed to update course');
      }
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

export const useCreateCourseResource = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: FormData }) =>
      courseService.createCourseResource(courseId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses', variables.courseId, 'resources'] });
      toast.success('Resource added');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Failed to add resource';
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
