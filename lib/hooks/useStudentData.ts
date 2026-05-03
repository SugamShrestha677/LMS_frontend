'use client';

import { useQuery } from '@tanstack/react-query';
import { studentApi } from '@/lib/api/student';

const USE_MOCK = true;

export function useStudentDashboard() {
  return useQuery({
    queryKey: ['student', 'dashboard'],
    queryFn: async () => {
      if (USE_MOCK) {
        return {
          stats: { total_courses: 12, total_badges: 8, avg_score: 88, study_hours: '24h' },
          activity_data: [
            { name: 'Mon', hours: 2 }, { name: 'Tue', hours: 4 }, { name: 'Wed', hours: 3 },
            { name: 'Thu', hours: 5 }, { name: 'Fri', hours: 2 }, { name: 'Sat', hours: 6 },
            { name: 'Sun', hours: 4 },
          ],
          recent_badges: [
            { id: 1, name: 'Quick Learner', icon: 'Zap', date: '2024-04-20' },
            { id: 2, name: 'Python Pro', icon: 'Code', date: '2024-04-18' },
            { id: 3, name: 'Logic Master', icon: 'Brain', date: '2024-04-15' },
          ],
          ongoing_courses: [
            { id: 101, title: 'Advanced React Patterns', progress: 65, next_lesson: 'Compound Components' },
            { id: 102, title: 'Backend with Django', progress: 40, next_lesson: 'Custom Middlewares' },
          ]
        };
      }
      return studentApi.getDashboard();
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useStudentCourses() {
  return useQuery({
    queryKey: ['student', 'courses'],
    queryFn: async () => {
      if (USE_MOCK) {
        return [
          { id: 1, title: 'Introduction to Web Dev', category: 'Frontend', progress: 100, lessons_count: 12 },
          { id: 2, title: 'Modern React Patterns', category: 'Frontend', progress: 65, lessons_count: 24 },
          { id: 3, title: 'Database Design 101', category: 'Backend', progress: 0, lessons_count: 10 },
          { id: 4, title: 'UI Design Principles', category: 'Design', progress: 20, lessons_count: 15 },
        ];
      }
      return studentApi.getCourses();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useEnrolledCourses() {
  return useQuery({
    queryKey: ['student', 'courses', 'enrolled'],
    queryFn: async () => {
      if (USE_MOCK) {
        return [
          { id: 2, title: 'Modern React Patterns', progress: 65, lessons_count: 24, category: 'Frontend' },
          { id: 4, title: 'UI Design Principles', progress: 20, lessons_count: 15, category: 'Design' },
        ];
      }
      return studentApi.getEnrolledCourses();
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useStudentBadges() {
  return useQuery({
    queryKey: ['student', 'badges'],
    queryFn: async () => {
      if (USE_MOCK) {
        return [
          { id: 1, name: 'React Expert', date: '2024-03-12', rarity: 'Gold' },
          { id: 2, name: 'Django Master', date: '2024-02-28', rarity: 'Gold' },
          { id: 3, name: 'TypeScript Pro', date: '2024-03-25', rarity: 'Silver' },
        ];
      }
      return studentApi.getBadges();
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useStudentProgress() {
  return useQuery({
    queryKey: ['student', 'progress'],
    queryFn: async () => {
      if (USE_MOCK) return { current: 75, target: 100 };
      return studentApi.getProgress();
    },
  });
}

export function useStudentProfile() {
  return useQuery({
    queryKey: ['student', 'profile'],
    queryFn: async () => {
      if (USE_MOCK) {
        return {
          id: 1,
          education: 'Pulchowk Campus',
          badges: [
            { id: 1, name: 'React Expert', date: '2024-03-12', rarity: 'Gold' },
            { id: 2, name: 'Django Master', date: '2024-02-28', rarity: 'Gold' },
            { id: 3, name: 'TypeScript Pro', date: '2024-03-25', rarity: 'Silver' },
          ]
        };
      }
      return studentApi.getProfile();
    },
  });
}

export function useStudentJobs() {
  return useQuery({
    queryKey: ['student', 'jobs'],
    queryFn: async () => {
      if (USE_MOCK) {
        return [
          { id: 1, title: 'Frontend Engineer', company: 'Leapfrog', location: 'Kathmandu', match: 98, salary: 'रू 1.5L', posted: '2024-04-28', required_badges: ['React Expert'], type: 'Full-time' },
          { id: 2, title: 'Python Dev', company: 'LogPoint', location: 'Lalitpur', match: 85, salary: 'रू 1.2L', posted: '2024-04-27', required_badges: ['Django Master'], type: 'Full-time' },
        ];
      }
      return studentApi.getJobs();
    },
  });
}
