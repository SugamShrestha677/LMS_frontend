'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { FileText, Search, Filter, ArrowUpRight, Clock, Shield, User } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const mockLogs = [
  { id: 1, action: 'ADMIN_LOGIN', user: 'admin@leapfrog.com', target: 'System', timestamp: '2024-05-03 14:20:01', status: 'success' },
  { id: 2, action: 'COURSE_CREATED', user: 'sarah.admin', target: 'Fullstack JS', timestamp: '2024-05-03 12:45:12', status: 'success' },
  { id: 3, action: 'USER_DELETED', user: 'root_super', target: 'temp_user_12', timestamp: '2024-05-03 10:15:33', status: 'warning' },
  { id: 4, action: 'SETTINGS_UPDATE', user: 'system', target: 'Email Gateway', timestamp: '2024-05-03 09:00:00', status: 'success' },
  { id: 5, action: 'AUTH_FAILURE', user: 'unknown_ip', target: 'SuperAdmin Portal', timestamp: '2024-05-02 23:55:41', status: 'error' },
];

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-text-primary)] tracking-tight">Audit <span className="text-[var(--color-primary)]">Logs</span></h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Platform-wide security and activity trail</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:bg-[var(--color-muted)] transition-all flex items-center gap-2">
            <Filter size={14} /> Filter
          </button>
          <button className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-lg shadow-[var(--color-primary)]/20">
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-600">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Total Events</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)]">14,282</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-600">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Active Sessions</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)]">86</p>
            </div>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-600">
              <ArrowUpRight size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Security Alerts</p>
              <p className="text-2xl font-black text-[var(--color-text-primary)]">12</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & List */}
      <Card padding="none" className="overflow-hidden border-none shadow-2xl">
        <div className="p-6 border-b border-[var(--color-border)] bg-[var(--color-bg-card)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
            <input
              type="text"
              placeholder="Search by user or action..."
              className="w-full pl-12 pr-4 py-3 bg-[var(--color-muted)]/50 border border-[var(--color-border)] rounded-2xl text-sm font-medium focus:border-[var(--color-primary)] outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-muted)]/30">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Action</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">User</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Target</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Timestamp</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--color-muted)]/10 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                        <FileText size={14} />
                      </div>
                      <span className="text-sm font-black text-[var(--color-text-primary)]">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)] font-medium">
                      <User size={14} /> {log.user}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-[var(--color-text-primary)] font-bold">{log.target}</td>
                  <td className="px-6 py-5 text-xs text-[var(--color-text-secondary)] font-mono">{log.timestamp}</td>
                  <td className="px-6 py-5">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      log.status === 'success' ? "bg-emerald-500/10 text-emerald-600" :
                      log.status === 'warning' ? "bg-amber-500/10 text-amber-600" :
                      "bg-red-500/10 text-red-600"
                    )}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg-card)] flex items-center justify-between">
          <p className="text-xs text-[var(--color-text-secondary)] font-medium">Showing 5 of 14,282 events</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-xs font-bold disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 border border-[var(--color-border)] rounded-lg text-xs font-bold hover:bg-[var(--color-muted)] transition-all">Next</button>
          </div>
        </div>
      </Card>
    </div>
  );
}
