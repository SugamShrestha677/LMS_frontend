import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-IN').format(n);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleBadgeColor(role: string): string {
  switch (role) {
    case 'super_admin': return 'bg-red-100 text-red-700';
    case 'admin': return 'bg-purple-100 text-purple-700';
    case 'staff': return 'bg-blue-100 text-blue-700';
    case 'tutor': return 'bg-amber-100 text-amber-700';
    case 'company': return 'bg-emerald-100 text-emerald-700';
    case 'student': return 'bg-sky-100 text-sky-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'student': return '/student/dashboard';
    case 'company': return '/company/dashboard';
    case 'admin':
    case 'super_admin':
    case 'staff': return '/admin/dashboard';
    default: return '/';
  }
}
