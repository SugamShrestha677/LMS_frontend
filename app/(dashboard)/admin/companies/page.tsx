'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function AdminCompaniesPage() {
  return (
    <UserManagement 
      roleFilter="company" 
      title="Company Partners" 
      subtitle="Manage enterprise accounts, hiring partners, and corporate dashboards."
    />
  );
}
