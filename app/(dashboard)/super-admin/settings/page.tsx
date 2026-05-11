'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useProfile } from '@/lib/hooks/useAuth';
import { authService } from '@/lib/services/auth.service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Settings, User, Shield, Bell, 
  Monitor, Globe, Lock, Save,
  CheckCircle2, AlertCircle, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type TabType = 'account' | 'security' | 'preferences';

export default function SuperAdminSettings() {
  const { user: authUser } = useAuthStore();
  const { data: profileData, isLoading: isLoadingProfile, refetch } = useProfile();
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
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

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-muted)]/30 p-10 rounded-[3rem] border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Settings size={200} />
        </div>
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            System <span className="text-[var(--color-primary)]">Configuration</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Manage your super admin account and global platform preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all group",
                activeTab === tab.id 
                  ? "bg-[var(--color-primary)] text-white shadow-xl shadow-[var(--color-primary)]/20" 
                  : "bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/30 hover:text-[var(--color-text-primary)]"
              )}
            >
              <tab.icon size={18} className={cn(activeTab === tab.id ? "text-white" : "text-[var(--color-text-secondary)] group-hover:text-[var(--color-primary)]")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-xl rounded-[2.5rem] border-none shadow-2xl">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] border-2 border-dashed border-[var(--color-primary)]/30">
                        {profileData?.profile?.profile_picture_url ? (
                          <img src={profileData.profile.profile_picture_url} alt="Profile" className="w-full h-full object-cover rounded-3xl" />
                        ) : (
                          <User size={40} />
                        )}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-[var(--color-border)] text-[var(--color-primary)] hover:scale-110 transition-transform">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">Personal Details</h3>
                      <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Super Admin Account</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input 
                        label="Full Name" 
                        value={formData.full_name}
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        placeholder="Enter your full name"
                      />
                      <Input 
                        label="Personal Email" 
                        value={formData.personal_email}
                        onChange={(e) => setFormData({...formData, personal_email: e.target.value})}
                        placeholder="For notifications"
                      />
                      <Input 
                        label="Phone Number" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+977 98XXXXXXXX"
                      />
                      <Input 
                        label="Department" 
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        placeholder="Management"
                      />
                    </div>
                    
                    <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="h-14 px-10 rounded-2xl shadow-xl shadow-[var(--color-primary)]/20 font-black text-xs uppercase tracking-widest flex items-center gap-2"
                      >
                        {isSaving ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}
                        Save Profile
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-[var(--color-bg-card)] to-[var(--color-primary)]/[0.03] rounded-[2.5rem] border-none shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                      <Shield size={20} />
                    </div>
                    <h3 className="font-black text-lg text-[var(--color-text-primary)]">Access Level</h3>
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] font-medium leading-relaxed max-w-2xl">
                    You have unrestricted access to all platform modules, including financial data, system logs, and user management.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {['Global Admin', 'DB Access', 'Finance Lead', 'Security Audit'].map((role) => (
                      <span key={role} className="px-4 py-2 rounded-xl bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-xl rounded-[2.5rem] border-none shadow-2xl">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 rounded-2xl bg-red-500/10 text-red-600">
                      <Lock size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">Security Credentials</h3>
                      <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Keep your account secure</p>
                    </div>
                  </div>

                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="space-y-6">
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
                    </div>

                    <div className="pt-6 border-t border-[var(--color-border)] flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isSaving}
                        className="h-14 px-10 rounded-2xl shadow-xl shadow-red-500/20 bg-red-600 hover:bg-red-700 font-black text-xs uppercase tracking-widest flex items-center gap-2"
                      >
                        <Shield size={18} />
                        Update Security
                      </Button>
                    </div>
                  </form>
                </Card>

                <Card className="p-8 bg-amber-500/[0.03] rounded-[2.5rem] border border-amber-500/10 shadow-xl">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0">
                      <AlertCircle size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-[var(--color-text-primary)]">Last Password Update</h4>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1 font-medium">Your password was last changed 3 months ago. We recommend regular updates for super admin accounts.</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-xl rounded-[2.5rem] border-none shadow-2xl">
                   <div className="flex items-center gap-4 mb-10">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600">
                      <Monitor size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-[var(--color-text-primary)] tracking-tight">System Preferences</h3>
                      <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest mt-1">Customize your experience</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-6 rounded-3xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                           <Globe size={20} className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-text-primary)]">Public Registration</p>
                          <p className="text-xs text-[var(--color-text-secondary)] font-medium">Allow students and companies to self-register.</p>
                        </div>
                      </div>
                      <div className="w-14 h-8 rounded-full bg-[var(--color-primary)] p-1 cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-white ml-auto shadow-md" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-6 rounded-3xl bg-[var(--color-muted)]/30 border border-[var(--color-border)]">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                           <Bell size={20} className="text-[var(--color-primary)]" />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-text-primary)]">Push Notifications</p>
                          <p className="text-xs text-[var(--color-text-secondary)] font-medium">Receive real-time alerts for critical system events.</p>
                        </div>
                      </div>
                      <div className="w-14 h-8 rounded-full bg-[var(--color-muted)] p-1 cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-white shadow-md" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
