'use client';

import { UserManagement } from '@/components/admin/UserManagement';

export default function CompaniesPage() {
  return (
    <UserManagement 
      roleFilter="company" 
      title="Partner Companies" 
      subtitle="Enterprise partnerships and hiring pipelines management." 
    />
  );
}
