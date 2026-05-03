'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Building2, Plus, Search, Filter, MoreHorizontal, Users, Briefcase, MapPin } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockCompanies = [
  { id: 1, name: 'Meta Nepal', industry: 'Software Engineering', hires: 42, locations: 2, status: 'verified' },
  { id: 2, name: 'Everest Tech', industry: 'Data Analytics', hires: 18, locations: 1, status: 'pending' },
  { id: 3, name: 'Leapfrog Tech', industry: 'Cloud Solutions', hires: 156, locations: 4, status: 'verified' },
  { id: 4, name: 'Kathmandu Digital', industry: 'Creative Agency', hires: 12, locations: 1, status: 'verified' },
];

export default function CompaniesPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">Partner <span className="text-[var(--color-primary)]">Companies</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Enterprise partnerships and hiring pipelines</p>
        </div>
        <button className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20 flex items-center gap-2">
          <Plus size={16} /> Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Total Partners</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">86</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Active Job Posts</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">248</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Total Hired</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">1,842</p>
        </Card>
        <Card>
          <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.2em] mb-1">Verification Queue</p>
          <p className="text-2xl font-black text-[var(--color-text-primary)]">12</p>
        </Card>
      </div>

      <Card padding="none" className="overflow-hidden border-none shadow-2xl">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <input
              type="text"
              placeholder="Search companies..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-muted)]/50 border border-[var(--color-border)] rounded-2xl text-sm font-medium focus:border-[var(--color-primary)] outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Company</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Industry</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Total Hires</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Locations</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {mockCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-[var(--color-muted)]/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                        <Building2 size={18} />
                      </div>
                      <span className="text-sm font-black text-[var(--color-text-primary)]">{company.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-[var(--color-text-secondary)] font-bold">{company.industry}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-primary)] font-black">
                      <Briefcase size={14} className="text-[var(--color-text-secondary)]" /> {company.hires}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] font-bold">
                      <MapPin size={14} /> {company.locations}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      company.status === 'verified' ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    )}>
                      {company.status}
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
