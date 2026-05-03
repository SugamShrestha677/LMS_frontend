'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function SuperAdminUsersPage() {
  return (
    <UserManagement 
      title="Platform Users" 
      subtitle="Manage and monitor all system accounts and activity." 
    />
  );
}
