'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { companyApi } from '@/lib/api/company';
import { toast } from 'sonner';

const USE_MOCK = true;

export function useCompanyDashboard() {
  return useQuery({
    queryKey: ['company', 'dashboard'],
    queryFn: async () => {
      if (USE_MOCK) {
        return {
          stats: { active_jobs: 8, total_candidates: 156, shortlisted: 24, placement_rate: '92%' },
          top_candidates: [
            { id: 1, name: 'Sita Sharma', role: 'Fullstack Developer', score: 94, location: 'Kathmandu', badges: 8 },
            { id: 2, name: 'Ram Bahadur', role: 'Python Engineer', score: 88, location: 'Lalitpur', badges: 6 },
            { id: 3, name: 'Maya Tamang', role: 'UI/UX Designer', score: 85, location: 'Pokhara', badges: 5 },
          ],
          recent_applications: [
            { id: 10, candidate: 'Hari Prasad', job: 'Senior React Dev', date: '2024-04-28', status: 'Pending' },
            { id: 11, candidate: 'Anita Rai', job: 'Backend Intern', date: '2024-04-27', status: 'Shortlisted' },
          ]
        };
      }
      return companyApi.getDashboard();
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useTalentPool(filters?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['company', 'talent-pool', filters],
    queryFn: async () => {
      if (USE_MOCK) {
        return [
          { id: 1, name: 'Prabhat Gurung', role: 'Full Stack Developer', location: 'Kathmandu', match_score: 96, badges: ['React Expert', 'Django Master'], education: 'IOE', experience: '2+ Years' },
          { id: 2, name: 'Sunita Thapa', role: 'Data Scientist', location: 'Pokhara', match_score: 89, badges: ['Python Pro', 'TensorFlow'], education: 'KU', experience: '1 Year' },
          { id: 3, name: 'Rohan Shrestha', role: 'UI Designer', location: 'Lalitpur', match_score: 82, badges: ['Figma Pro'], education: 'KU', experience: '3+ Years' },
        ];
      }
      return companyApi.getTalentPool(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useShortlisted() {
  return useQuery({
    queryKey: ['company', 'shortlisted'],
    queryFn: async () => {
      if (USE_MOCK) return [];
      return companyApi.getShortlisted();
    },
  });
}

export function useShortlistCandidate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (USE_MOCK) return { success: true };
      return companyApi.shortlistCandidate(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company', 'shortlisted'] });
      toast.success('Candidate shortlisted!');
    },
  });
}

export function useRemoveShortlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (USE_MOCK) return { success: true };
      return companyApi.removeShortlist(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['company', 'shortlisted'] });
      toast.success('Removed from shortlist.');
    },
  });
}

export function useCompanyJobs() {
  return useQuery({
    queryKey: ['company', 'jobs'],
    queryFn: async () => {
      if (USE_MOCK) return [
        { id: 1, title: 'Senior React Dev', type: 'Full-time', apps: 42, match: 5 },
        { id: 2, title: 'Backend Intern', type: 'Internship', apps: 156, match: 28 },
      ];
      return companyApi.getJobs();
    },
  });
}

export function useCompanyInterviews() {
  return useQuery({
    queryKey: ['company', 'interviews'],
    queryFn: async () => {
      if (USE_MOCK) return [];
      return companyApi.getInterviews();
    },
  });
}

export function useCompanyProfile() {
  return useQuery({
    queryKey: ['company', 'profile'],
    queryFn: async () => {
      if (USE_MOCK) return { name: 'Leapfrog Tech', location: 'Kathmandu' };
      return companyApi.getProfile();
    },
  });
}
