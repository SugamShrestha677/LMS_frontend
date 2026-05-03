'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function SuperAdminUsersPage() {
  return (
    <UserManagement 
      roleFilter="student" 
      title="Platform Students" 
      subtitle="Manage and monitor student accounts and progress." 
    />
  );
}
