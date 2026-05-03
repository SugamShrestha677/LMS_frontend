import { UserRole } from '@/lib/types/auth';

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  super_admin: '/super-admin/dashboard',
  admin: '/admin/dashboard',
  staff: '/staff/dashboard',
  tutor: '/tutor/dashboard',
  company: '/company/dashboard',
  student: '/student/dashboard',
};

export const getDashboardRoute = (role: UserRole): string => {
  return ROLE_DASHBOARDS[role] || '/dashboard';
};

export const getRoleLabel = (role: UserRole): string => {
  const labels: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    staff: 'Staff',
    tutor: 'Tutor',
    company: 'Company',
    student: 'Student',
  };
  return labels[role] || role;
};

export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    super_admin: 'bg-purple-100 text-purple-800',
    admin: 'bg-blue-100 text-blue-800',
    staff: 'bg-green-100 text-green-800',
    tutor: 'bg-orange-100 text-orange-800',
    company: 'bg-indigo-100 text-indigo-800',
    student: 'bg-gray-100 text-gray-800',
  };
  return colors[role] || 'bg-gray-100 text-gray-800';
};

export const ROLE_NAV_ITEMS: Record<UserRole, { label: string; href: string; icon: string; badge?: string }[]> = {
  super_admin: [
    { label: 'Dashboard', href: '/super-admin', icon: 'LayoutDashboard' },
    { label: 'Admins', href: '/super-admin/admins', icon: 'Shield' },
    { label: 'Staff', href: '/super-admin/staff', icon: 'Users' },
    { label: 'Tutors', href: '/super-admin/tutors', icon: 'GraduationCap' },
    { label: 'Students', href: '/super-admin/students', icon: 'UserCheck' },
    { label: 'Companies', href: '/super-admin/companies', icon: 'Building2' },
    { label: 'Courses', href: '/super-admin/courses', icon: 'BookOpen' },
    { label: 'Finance', href: '/super-admin/finance', icon: 'DollarSign' },
    { label: 'Analytics', href: '/super-admin/analytics', icon: 'BarChart3' },
    { label: 'Billing', href: '/super-admin/billing', icon: 'CreditCard' },
    { label: 'Audit Logs', href: '/super-admin/audit-logs', icon: 'FileText' },
    { label: 'Settings', href: '/super-admin/settings', icon: 'Settings' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
    { label: 'Staff', href: '/admin/staff', icon: 'Users' },
    { label: 'Tutors', href: '/admin/tutors', icon: 'GraduationCap' },
    { label: 'Students', href: '/admin/students', icon: 'UserCheck' },
    { label: 'Companies', href: '/admin/companies', icon: 'Building2' },
    { label: 'Courses', href: '/admin/courses', icon: 'BookOpen' },
    { label: 'Events', href: '/admin/events', icon: 'Calendar' },
    { label: 'Finance', href: '/admin/finance', icon: 'DollarSign' },
    { label: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
  staff: [
    { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Tutors', href: '/dashboard/tutors', icon: 'GraduationCap' },
    { label: 'Students', href: '/dashboard/students', icon: 'UserCheck' },
    { label: 'Companies', href: '/dashboard/companies', icon: 'Building2' },
    { label: 'Courses', href: '/dashboard/courses', icon: 'BookOpen' },
  ],
  tutor: [
    { label: 'Dashboard', href: '/tutor', icon: 'LayoutDashboard' },
    { label: 'My Courses', href: '/tutor/courses', icon: 'BookOpen' },
    { label: 'Students', href: '/tutor/students', icon: 'Users' },
    { label: 'Assessments', href: '/tutor/assessments', icon: 'ClipboardCheck' },
    { label: 'Certificates', href: '/tutor/certificates', icon: 'Award' },
  ],
  company: [
    { label: 'Dashboard', href: '/company', icon: 'LayoutDashboard' },
    { label: 'Talent Pool', href: '/company/talent-pool', icon: 'Users' },
    { label: 'Interviews', href: '/company/interviews', icon: 'Calendar' },
    { label: 'Hired', href: '/company/hired', icon: 'UserPlus' },
  ],
  student: [
    { label: 'Dashboard', href: '/student', icon: 'LayoutDashboard' },
    { label: 'Browse Courses', href: '/student/courses', icon: 'BookOpen' },
    { label: 'My Learning', href: '/student/learning', icon: 'GraduationCap' },
    { label: 'Assessments', href: '/student/assessments', icon: 'ClipboardCheck' },
    { label: 'Certificates', href: '/student/certificates', icon: 'Award' },
    { label: 'Jobs', href: '/student/jobs', icon: 'Briefcase' },
    { label: 'Profile', href: '/student/profile', icon: 'User' },
  ],
};