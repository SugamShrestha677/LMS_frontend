'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function StaffCompaniesPage() {
  return (
    <UserManagement 
      roleFilter="company" 
      title="Company Management" 
      subtitle="Manage corporate partners and their associated student accounts."
    />
  );
}
