'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function StaffTutorsPage() {
  return (
    <UserManagement 
      roleFilter="tutor" 
      title="Tutor Management" 
      subtitle="Manage instructors, monitor their performance, and assign courses."
    />
  );
}
