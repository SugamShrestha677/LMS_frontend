'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfile } from '@/lib/hooks/useAuth';
import { authService } from '@/lib/services/auth.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  User, Lock, Save, Camera, Shield,
  Bell, Settings, Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function StaffSettingsPage() {
  const { user: authUser } = useAuthStore();
  const { data: profileData, isLoading, refetch } = useProfile();
  const [activeTab, setActiveTab] = useState<'account' | 'security' | 'permissions'>('account');
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    department: '',
    personal_email: ''
  });

  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        full_name: profileData.profile?.full_name || '',
        phone: profileData.profile?.phone || '',
        department: profileData.profile?.department || '',
        personal_email: profileData.personal_email || ''
      });
    }
  }, [profileData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateProfile(formData);
      toast.success('Profile updated successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    setIsSaving(true);
    try {
      await authService.changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ old_password: '', new_password: '', confirm_password: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight uppercase">
            Staff <span className="text-[var(--color-primary)]">Settings</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1 font-medium">Manage your professional profile and account security.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 space-y-2">
          {[
            { id: 'account', label: 'Account', icon: User },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'permissions', label: 'Permissions', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all",
                activeTab === tab.id 
                  ? "bg-[var(--color-primary)] text-white shadow-lg" 
                  : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <Card className="p-8 rounded-[2rem] border-2 border-[var(--color-border)]">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-3xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                      <User size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--color-text-primary)]">Profile Information</h3>
                      <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">{authUser?.email}</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Full Name" 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      />
                      <Input 
                        label="Personal Email" 
                        value={formData.personal_email}
                        onChange={(e) => setFormData({...formData, personal_email: e.target.value})}
                      />
                      <Input 
                        label="Phone Number" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                      <Input 
                        label="Department" 
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving} className="px-8 rounded-xl font-black uppercase tracking-widest text-xs h-12">
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <Card className="p-8 rounded-[2rem] border-2 border-[var(--color-border)]">
                  <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-8">Change Password</h3>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <Input 
                      label="Current Password" 
                      type="password"
                      value={passwordData.old_password}
                      onChange={(e) => setPasswordData({...passwordData, old_password: e.target.value})}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="New Password" 
                        type="password"
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                      />
                      <Input 
                        label="Confirm New Password" 
                        type="password"
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                      />
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={isSaving} className="px-8 rounded-xl font-black uppercase tracking-widest text-xs h-12 bg-red-600 hover:bg-red-700">
                        Update Password
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {activeTab === 'permissions' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <Card className="p-8 rounded-[2rem] border-2 border-[var(--color-border)]">
                  <h3 className="text-xl font-black text-[var(--color-text-primary)] mb-4">Your Permissions</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-8 font-medium">These permissions are assigned by your administrator and define your access levels.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { key: 'can_manage_courses', label: 'Manage Courses' },
                      { key: 'can_manage_students', label: 'Manage Students' },
                      { key: 'can_manage_tutors', label: 'Manage Tutors' },
                      { key: 'can_manage_companies', label: 'Manage Companies' },
                      { key: 'can_manage_payments', label: 'Manage Payments' },
                      { key: 'can_manage_settings', label: 'Manage Settings' },
                    ].map((perm) => {
                      const hasPerm = profileData?.profile?.permissions?.[perm.key] || profileData?.permissions?.[perm.key];
                      return (
                        <div key={perm.key} className="flex items-center justify-between p-4 rounded-2xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]">
                          <span className="text-sm font-bold text-[var(--color-text-primary)]">{perm.label}</span>
                          {hasPerm ? (
                            <div className="px-3 py-1 bg-green-500/10 text-green-600 rounded-lg text-[10px] font-black uppercase">Active</div>
                          ) : (
                            <div className="px-3 py-1 bg-red-500/10 text-red-600 rounded-lg text-[10px] font-black uppercase">Denied</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
