'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Settings, Shield, Bell, Globe, Palette } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            System <span className="text-[var(--color-primary)]">Settings</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Configure platform-wide preferences and security policies.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2rem] border border-[var(--color-border)] shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
              <Globe size={20} />
            </div>
            <h3 className="font-black text-xl text-[var(--color-text-primary)]">General Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Platform Name" defaultValue="Leapfrog Connect" />
            <Input label="Support Email" defaultValue="support@leapfrogconnect.com" />
          </div>
        </Card>

        <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2rem] border border-[var(--color-border)] shadow-xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
              <Shield size={20} />
            </div>
            <h3 className="font-black text-xl text-[var(--color-text-primary)]">Security & Privacy</h3>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-bg-card)]/50 border border-[var(--color-border)] hover:bg-[var(--color-primary)]/5 transition-colors">
              <div>
                <p className="font-bold text-[var(--color-text-primary)]">Two-Factor Authentication</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Require 2FA for all administrative accounts.</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-[var(--color-primary)] relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-bg-card)]/50 border border-[var(--color-border)] hover:bg-[var(--color-primary)]/5 transition-colors">
              <div>
                <p className="font-bold text-[var(--color-text-primary)]">Registration Approval</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Manually approve all new student registrations.</p>
              </div>
              <div className="w-12 h-6 rounded-full bg-[var(--color-muted)] relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm" />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" className="px-8 rounded-xl h-12 border-2 font-black text-xs uppercase tracking-widest">Discard Changes</Button>
          <Button className="px-8 rounded-xl h-12 shadow-lg shadow-[var(--color-primary)]/20 font-black text-xs uppercase tracking-widest">Save Configuration</Button>
        </div>
      </div>
    </div>
  );
}
