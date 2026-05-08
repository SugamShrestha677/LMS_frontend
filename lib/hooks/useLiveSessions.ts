import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { liveSessionService } from '@/lib/services/liveSession.service';
import { toast } from 'react-hot-toast';

// ── Student / Shared ──────────────────────────────────────────────────────────

export const useLiveSessions = (courseId: number) =>
  useQuery({
    queryKey: ['courses', courseId, 'live-sessions'],
    queryFn: () => liveSessionService.getSessions(courseId),
    enabled: !!courseId,
  });

export const useLiveSession = (courseId: number, sessionId: number) =>
  useQuery({
    queryKey: ['courses', courseId, 'live-sessions', sessionId],
    queryFn: () => liveSessionService.getSession(courseId, sessionId),
    enabled: !!courseId && !!sessionId,
  });

// ── Tutor / Admin CRUD ────────────────────────────────────────────────────────

export const useCreateLiveSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, data }: { courseId: number; data: any }) =>
      liveSessionService.createSession(courseId, data),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ['courses', courseId, 'live-sessions'] });
      toast.success('Live session scheduled!');
    },
    onError: () => toast.error('Failed to create session'),
  });
};

export const useUpdateLiveSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      sessionId,
      data,
    }: {
      courseId: number;
      sessionId: number;
      data: any;
    }) => liveSessionService.updateSession(courseId, sessionId, data),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ['courses', courseId, 'live-sessions'] });
      toast.success('Session updated!');
    },
    onError: () => toast.error('Failed to update session'),
  });
};

export const useDeleteLiveSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ courseId, sessionId }: { courseId: number; sessionId: number }) =>
      liveSessionService.deleteSession(courseId, sessionId),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ['courses', courseId, 'live-sessions'] });
      toast.success('Session deleted');
    },
    onError: () => toast.error('Failed to delete session'),
  });
};

export const useMarkAttendance = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      sessionId,
      records,
    }: {
      courseId: number;
      sessionId: number;
      records: any[];
    }) => liveSessionService.markAttendance(courseId, sessionId, records),
    onSuccess: (_, { courseId, sessionId }) => {
      qc.invalidateQueries({ queryKey: ['courses', courseId, 'live-sessions', sessionId, 'report'] });
      toast.success('Attendance saved!');
    },
    onError: () => toast.error('Failed to save attendance'),
  });
};

export const useAddSessionSummary = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      sessionId,
      data,
    }: {
      courseId: number;
      sessionId: number;
      data: any;
    }) => liveSessionService.addSummary(courseId, sessionId, data),
    onSuccess: (_, { courseId }) => {
      qc.invalidateQueries({ queryKey: ['courses', courseId, 'live-sessions'] });
      toast.success('Session summary published!');
    },
    onError: () => toast.error('Failed to save summary'),
  });
};

export const useAttendanceReport = (courseId: number, sessionId: number) =>
  useQuery({
    queryKey: ['courses', courseId, 'live-sessions', sessionId, 'report'],
    queryFn: () => liveSessionService.getAttendanceReport(courseId, sessionId),
    enabled: !!courseId && !!sessionId,
  });

export const useAttendanceOverview = (courseId: number) =>
  useQuery({
    queryKey: ['courses', courseId, 'attendance-overview'],
    queryFn: () => liveSessionService.getAttendanceOverview(courseId),
    enabled: !!courseId,
  });
