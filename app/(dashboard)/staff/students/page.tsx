'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function StaffStudentsPage() {
  return (
    <UserManagement 
      roleFilter="student" 
      title="Student Management" 
      subtitle="View and manage student accounts and their enrollment status."
    />
  );
}
