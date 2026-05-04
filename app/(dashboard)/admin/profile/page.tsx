'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Shield, Camera, Edit2 } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function AdminProfilePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Admin <span className="text-[var(--color-primary)]">Profile</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Manage your personal information and account security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-8 text-center bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-border)] shadow-xl">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-3xl bg-[var(--color-primary)] flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-[var(--color-primary)]/30">
                {user ? getInitials(`${user.first_name || ''} ${user.last_name || ''}`) || user.email.slice(0, 2).toUpperCase() : 'A'}
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-[var(--color-bg-card)] text-[var(--color-primary)] shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-[var(--color-border)]">
                <Camera size={18} />
              </button>
            </div>
            <h2 className="text-2xl font-black text-[var(--color-text-primary)]">{user?.first_name} {user?.last_name}</h2>
            <p className="text-xs font-black text-[var(--color-primary)] uppercase tracking-widest mt-1">{user?.role?.replace('_', ' ')}</p>
            
            <div className="mt-8 pt-8 border-t border-[var(--color-border)]">
              <div className="flex items-center justify-between text-sm mb-4">
                <span className="text-[var(--color-text-secondary)] font-medium">Status</span>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-black text-[10px] uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--color-text-secondary)] font-medium">Member Since</span>
                <span className="font-bold text-[var(--color-text-primary)]">Jan 2024</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-border)] shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-xl text-[var(--color-text-primary)]">Personal Details</h3>
              <Button variant="ghost" size="sm" className="text-[var(--color-primary)] font-black text-[10px] uppercase tracking-widest">
                <Edit2 size={14} className="mr-2" /> Edit Details
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="First Name" defaultValue={user?.first_name || ''} />
              <Input label="Last Name" defaultValue={user?.last_name || ''} />
              <div className="md:col-span-2">
                <Input label="Email Address" defaultValue={user?.email || ''} icon={<Mail size={18} />} readOnly />
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-border)] shadow-xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600">
                <Shield size={20} />
              </div>
              <h3 className="font-black text-xl text-[var(--color-text-primary)]">Security Management</h3>
            </div>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-2 font-black text-xs uppercase tracking-widest">
                Change Password
                <Edit2 size={16} />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
