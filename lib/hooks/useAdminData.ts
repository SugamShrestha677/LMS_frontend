'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi } from '@/lib/api/admin';

const USE_MOCK = true;

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      if (USE_MOCK) {
        return {
          stats: { total_students: '12,450', total_companies: '580', total_courses: '142', revenue: 'रू 8.2M' },
          growth_data: [
            { name: 'Jan', students: 400, companies: 240 },
            { name: 'Feb', students: 600, companies: 300 },
            { name: 'Mar', students: 800, companies: 450 },
            { name: 'Apr', students: 1100, companies: 600 },
          ],
          pending_approvals: [
            { id: 1, name: 'Meta Nepal', type: 'Company', date: '2024-04-29' },
            { id: 2, name: 'Everest Tech', type: 'Company', date: '2024-04-28' },
            { id: 3, name: 'Dr. Rabin KC', type: 'Tutor', date: '2024-04-27' },
          ]
        };
      }
      return adminApi.getDashboard();
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function useAdminUsers(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: async () => {
      if (USE_MOCK) {
        return [
          { id: 1, name: 'Sagar KC', email: 'sagar@leapfrog.com', role: 'student', status: 'active', joined: '2024-04-01' },
          { id: 2, name: 'Priya Shrestha', email: 'priya@meta.com', role: 'company', status: 'pending', joined: '2024-04-28' },
          { id: 3, name: 'Anil Kapoor', email: 'anil@staff.com', role: 'staff', status: 'active', joined: '2024-03-15' },
          { id: 4, name: 'Bina Tamang', email: 'bina@mail.com', role: 'student', status: 'banned', joined: '2024-01-10' },
        ];
      }
      return adminApi.getUsers(params);
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useAdminCompanies() {
  return useQuery({
    queryKey: ['admin', 'companies'],
    queryFn: async () => {
      if (USE_MOCK) return [];
      return adminApi.getCompanies();
    },
  });
}

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      if (USE_MOCK) return {};
      return adminApi.getAnalytics();
    },
  });
}

export function useAdminAlerts() {
  return useQuery({
    queryKey: ['admin', 'alerts'],
    queryFn: async () => {
      if (USE_MOCK) return [];
      return adminApi.getAlerts();
    },
    staleTime: 30 * 1000,
  });
}

export function useAdminAuditLogs(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ['admin', 'audit-logs', params],
    queryFn: async () => {
      if (USE_MOCK) return [];
      return adminApi.getAuditLogs(params);
    },
  });
}
