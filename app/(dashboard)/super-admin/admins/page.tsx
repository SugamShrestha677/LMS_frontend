'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function AdminsPage() {
  return (
    <UserManagement 
      roleFilter="admin" 
      title="System Administrators" 
      subtitle="Internal access control and role management." 
    />
  );
}
