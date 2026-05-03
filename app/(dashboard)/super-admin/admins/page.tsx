'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Shield, Plus, Search, Filter, MoreHorizontal, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockAdmins = [
  { id: 1, name: 'Admin One', role: 'Full Admin', email: 'admin1@leapfrog.com', status: 'active' },
  { id: 2, name: 'Support Lead', role: 'Support Admin', email: 'support@leapfrog.com', status: 'active' },
  { id: 3, name: 'Finance Manager', role: 'Finance Admin', email: 'finance@leapfrog.com', status: 'active' },
  { id: 4, name: 'Content Moderator', role: 'Course Admin', email: 'content@leapfrog.com', status: 'suspended' },
];

export default function AdminsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">System <span className="text-[var(--color-primary)]">Administrators</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Internal access control and role management</p>
        </div>
        <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2">
          <Plus size={16} /> New Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-600">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Total Admins</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)]">12</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-600">
              <Lock size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Active Permissions</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)]">242</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-600">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Pending Invites</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)]">3</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden border-none shadow-2xl">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <input
              type="text"
              placeholder="Search administrators..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-muted)]/50 border border-[var(--color-border)] rounded-2xl text-sm font-medium focus:border-[var(--color-primary)] outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Admin</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Email</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {mockAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-[var(--color-muted)]/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 font-black text-xs">
                        {admin.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-black text-[var(--color-text-primary)]">{admin.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-[10px] font-bold text-[var(--color-text-secondary)] uppercase">
                      {admin.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-[var(--color-text-secondary)] font-medium underline decoration-[var(--color-border)]">{admin.email}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      admin.status === 'active' ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                    )}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-[var(--color-text-secondary)]">
                    <button className="p-2 hover:bg-[var(--color-muted)] rounded-lg transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
