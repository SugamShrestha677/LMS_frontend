'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function TutorsPage() {
  return (
    <UserManagement 
      roleFilter="tutor" 
      title="Platform Tutors" 
      subtitle="Academic staff and expertise management" 
    />
  );
}
