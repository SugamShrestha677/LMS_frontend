export type UserRole = 'super_admin' | 'admin' | 'staff' | 'tutor' | 'company' | 'student';

export interface User {
  id: number;
  email: string;
  personal_email?: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  role: UserRole;
  must_change_password: boolean;
  profile_completed: boolean;
  is_super_admin?: boolean;
  created_by_email?: string;
  created_at?: string;
  updated_at?: string;
  permissions?: StaffPermission;
  profile?: any;
}

export interface StaffPermission {
  can_create_users: boolean;
  can_manage_courses: boolean;
  can_manage_students: boolean;
  can_manage_tutors: boolean;
  can_manage_companies: boolean;
  can_manage_payments: boolean;
  can_manage_settings: boolean;
  can_view_analytics: boolean;
  course_scope: 'all' | 'assigned';
}


export interface LoginResponse {
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  };
  redirect_to: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface FirstLoginInput {
  new_password: string;
  confirm_password: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface RegisterInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: 'student' | 'company';
  company_name?: string;
}

export interface AuditLog {
  id: number;
  user: number;
  user_email: string;
  performed_by: number;
  performed_by_email: string;
  action: string;
  action_display: string;
  description: string;
  metadata: Record<string, any>;
  ip_address: string;
  created_at: string;
}