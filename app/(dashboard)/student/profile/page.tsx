'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Award, Link as LinkIcon, Edit, Camera, Github, Linkedin,
  Lock, X, Mail, Phone, User, Calendar, FileText, Globe, Briefcase,
  CheckCircle, AlertCircle, Shield,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { studentApi } from '@/lib/api/student';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentBadges } from '@/components/badges/StudentBadges';
// ─── Types matching backend StudentProfileSerializer ─────────
interface ProfileResponse {
  id: number;
  email: string;
  personal_email?: string;
  role: string;
  profile_completed: boolean;
  profile?: {
    user_id: number;
    email: string;
    personal_email?: string;
    full_name?: string;
    phone?: string;
    date_of_birth?: string;
    bio?: string;
    cv_file_url?: string;
    portfolio_url?: string;
    linkedin_url?: string;
    github_url?: string;
    profile_picture_url?: string;
    is_in_talent_pool?: boolean;
    profile_strength?: number;
  };
}

export default function StudentProfile() {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();

  // ─── Fetch profile via /accounts/users/me/ ───────────────
  const { data: profileData, isLoading } = useQuery<ProfileResponse>({
    queryKey: ['student', 'profile'],
    queryFn: () => studentApi.getProfile(),
  });

  const profile = profileData?.profile;

  // ─── Modal states ────────────────────────────────────────
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [completeProfileOpen, setCompleteProfileOpen] = useState(false);

  // ─── Edit profile form ───────────────────────────────────
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    date_of_birth: '',
    bio: '',
    portfolio_url: '',
    linkedin_url: '',
    github_url: '',
  });

  // ─── Password form ──────────────────────────────────────
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Show "Complete Profile" prompt if profile not completed
  useEffect(() => {
    if (profileData && !profileData.profile_completed && !completeProfileOpen) {
      const dismissed = sessionStorage.getItem('profile_complete_dismissed');
      if (!dismissed) {
        setCompleteProfileOpen(true);
      }
    }
  }, [profileData, completeProfileOpen]);

  // ─── Update profile mutation ─────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => studentApi.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
      setEditModalOpen(false);
      setCompleteProfileOpen(false);
      // Update auth store
      if (user) setUser({ ...user, profile_completed: true });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Update failed');
    },
  });

  // ─── Avatar upload mutation ──────────────────────────────
  const avatarMutation = useMutation({
    mutationFn: (file: File) => studentApi.uploadAvatar(file),
    onSuccess: () => {
      toast.success('Profile picture updated');
      queryClient.invalidateQueries({ queryKey: ['student', 'profile'] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Avatar upload failed');
    },
  });

  // ─── Password change mutation ────────────────────────────
  const passwordMutation = useMutation({
    mutationFn: (data: { old_password: string; new_password: string; confirm_password: string }) =>
      studentApi.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
      setPasswordModalOpen(false);
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || 'Failed to change password');
    },
  });

  // ─── Handlers ────────────────────────────────────────────
  const openEditModal = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      date_of_birth: profile?.date_of_birth || '',
      bio: profile?.bio || '',
      portfolio_url: profile?.portfolio_url || '',
      linkedin_url: profile?.linkedin_url || '',
      github_url: profile?.github_url || '',
    });
    setEditModalOpen(true);
  };

  const openCompleteProfile = () => {
    setFormData({
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      date_of_birth: profile?.date_of_birth || '',
      bio: profile?.bio || '',
      portfolio_url: profile?.portfolio_url || '',
      linkedin_url: profile?.linkedin_url || '',
      github_url: profile?.github_url || '',
    });
    setCompleteProfileOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfile = () => updateMutation.mutate(formData);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.new_password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    passwordMutation.mutate(passwordForm);
  };

  const onAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) avatarMutation.mutate(file);
  };

  const dismissCompleteProfile = () => {
    sessionStorage.setItem('profile_complete_dismissed', '1');
    setCompleteProfileOpen(false);
  };

  // ─── Profile strength ───────────────────────────────────
  const strength = profile?.profile_strength ?? 0;

  const inputClass =
    'w-full p-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all';

  // ─── Loading state ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-60 w-full" rounded="lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 lg:col-span-2" rounded="lg" />
          <Skeleton className="h-48" rounded="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Profile Completion Banner ──────────────────── */}
      {profileData && !profileData.profile_completed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-2xl p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <AlertCircle className="text-amber-500" size={24} />
            </div>
            <div>
              <p className="font-bold text-[var(--color-text-primary)]">Complete Your Profile</p>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Fill in your details to unlock all features and get discovered by companies.
              </p>
            </div>
          </div>
          <Button variant="primary" size="md" onClick={openCompleteProfile}>
            Complete Now
          </Button>
        </motion.div>
      )}

      {/* ─── Profile Header Card ───────────────────────── */}
      <Card className="p-0 overflow-hidden border-[var(--color-border)] shadow-[var(--shadow-lg)]">
        <div className="h-40 bg-[var(--color-primary)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          <button
            onClick={openEditModal}
            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/10"
          >
            <Edit size={18} />
          </button>
        </div>
        <div className="px-10 pb-10">
          <div className="relative flex flex-col md:flex-row md:items-end gap-8 -mt-16">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] bg-[var(--color-bg-card)] p-2 shadow-2xl relative overflow-hidden">
                {profile?.profile_picture_url ? (
                  <Image
                    src={profile.profile_picture_url}
                    alt="Avatar"
                    fill
                    className="rounded-[2.25rem] object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-[2.25rem] bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-primary)] font-black text-5xl border border-[var(--color-border)]">
                    {getInitials(profile?.full_name || user?.email || 'S')}
                  </div>
                )}
              </div>
              <label className="absolute bottom-3 right-3 w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center border-4 border-[var(--color-bg-card)] shadow-lg hover:scale-110 transition-transform cursor-pointer">
                {avatarMutation.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Camera size={18} />
                )}
                <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onAvatarSelect} />
              </label>
            </div>

            <div className="flex-1 space-y-2 mb-2">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
                  {profile?.full_name || 'Student'}
                </h1>
                {profileData?.profile_completed && (
                  <Badge variant="success" size="md" dot pulse>Profile Complete</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-5 pt-2 text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                  <Mail size={12} className="text-[var(--color-primary)]" /> {profileData?.email}
                </span>
                {profile?.phone && (
                  <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                    <Phone size={12} className="text-[var(--color-primary)]" /> {profile.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left Column ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-8">
          {/* Bio Card */}
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight flex items-center gap-3">
              <User size={22} className="text-[var(--color-primary)]" /> Biography
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-loose font-medium">
              {profile?.bio || 'No bio added yet. Click edit to tell something about yourself.'}
            </p>
          </Card>

          {/* Profile Details */}
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8 tracking-tight flex items-center gap-3">
              <FileText size={22} className="text-[var(--color-primary)]" /> Profile Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: Calendar, label: 'Date of Birth', value: profile?.date_of_birth || 'Not set' },
                { icon: Phone, label: 'Phone', value: profile?.phone || 'Not set' },
                { icon: Globe, label: 'Portfolio', value: profile?.portfolio_url, isLink: true },
                { icon: Linkedin, label: 'LinkedIn', value: profile?.linkedin_url, isLink: true },
                { icon: Github, label: 'GitHub', value: profile?.github_url, isLink: true },
                { icon: FileText, label: 'CV', value: profile?.cv_file_url, isLink: true },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)]">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm shrink-0">
                    <item.icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">{item.label}</p>
                    {item.isLink && item.value ? (
                      <a href={item.value} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[var(--color-primary)] hover:underline truncate block">
                        {item.value.replace(/^https?:\/\//, '').slice(0, 40)}
                      </a>
                    ) : (
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{item.value || 'Not set'}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <StudentBadges />
        </div>

        {/* ─── Right Column ────────────────────────────── */}
        <div className="space-y-8">
          {/* Profile Strength */}
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight flex items-center gap-3">
              <Award size={22} className="text-amber-500" /> Profile Strength
            </h3>
            <div className="flex items-end gap-3 mb-4">
              <span className="text-5xl font-black font-mono text-[var(--color-text-primary)]">{strength}</span>
              <span className="text-[var(--color-text-secondary)] font-bold mb-2 text-lg">/ 100</span>
            </div>
            <div className="w-full h-3 rounded-full bg-[var(--color-muted)] border border-[var(--color-border)] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${strength}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  strength >= 75 ? 'bg-green-500' : strength >= 50 ? 'bg-amber-500' : 'bg-red-500'
                }`}
              />
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] mt-3">
              {strength < 50
                ? 'Add more details to improve your profile visibility.'
                : strength < 75
                ? 'Good progress! A few more fields to go.'
                : 'Excellent! Your profile is looking great.'}
            </p>
          </Card>

          {/* Security Card */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight flex items-center gap-3">
                <Shield size={22} className="text-[var(--color-primary)]" /> Security
              </h3>
              <Lock size={20} className="text-[var(--color-primary)]" />
            </div>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setPasswordModalOpen(true)}
              className="border-dashed border-2 py-6 rounded-2xl"
            >
              Change Password
            </Button>
          </Card>

          {/* Contact Info */}
          <Card className="p-8 bg-[var(--color-muted)] border-dashed border-2 border-[var(--color-border)]">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight">Contact Details</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Organization Email</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{profileData?.email}</p>
                </div>
              </div>
              {profileData?.personal_email && (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Personal Email</p>
                    <p className="text-sm font-bold text-[var(--color-text-primary)]">{profileData.personal_email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Phone</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{profile?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Edit Profile Modal ────────────────────────── */}
      {(editModalOpen || completeProfileOpen) && (
        <ProfileFormModal
          title={completeProfileOpen ? 'Complete Your Profile' : 'Edit Profile'}
          subtitle={completeProfileOpen ? 'Fill in these details to get started' : undefined}
          formData={formData}
          onChange={handleChange}
          onSave={saveProfile}
          onClose={() => {
            if (completeProfileOpen) dismissCompleteProfile();
            else setEditModalOpen(false);
          }}
          isSaving={updateMutation.isPending}
          inputClass={inputClass}
        />
      )}

      {/* ─── Change Password Modal ─────────────────────── */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-bg-card)] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[var(--color-border)]"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-[var(--color-text-primary)]">Change Password</h2>
              <button onClick={() => setPasswordModalOpen(false)} className="p-2 hover:bg-[var(--color-muted)] rounded-lg">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              {(['old_password', 'new_password', 'confirm_password'] as const).map((field) => (
                <div key={field}>
                  <label className="block text-sm font-bold mb-2 text-[var(--color-text-secondary)]">
                    {field === 'old_password' ? 'Current Password' : field === 'new_password' ? 'New Password' : 'Confirm New Password'}
                  </label>
                  <input
                    type="password"
                    name={field}
                    value={passwordForm[field]}
                    onChange={handlePasswordChange}
                    className={inputClass}
                    required
                    minLength={field !== 'old_password' ? 8 : undefined}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" fullWidth onClick={() => setPasswordModalOpen(false)}>Cancel</Button>
                <Button type="submit" variant="primary" fullWidth disabled={passwordMutation.isPending}>
                  {passwordMutation.isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// ─── Reusable Profile Form Modal ──────────────────────────────
function ProfileFormModal({
  title, subtitle, formData, onChange, onSave, onClose, isSaving, inputClass,
}: {
  title: string;
  subtitle?: string;
  formData: Record<string, string>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSave: () => void;
  onClose: () => void;
  isSaving: boolean;
  inputClass: string;
}) {
  const fields = [
    { name: 'full_name', label: 'Full Name', placeholder: 'e.g., John Doe', type: 'text' },
    { name: 'phone', label: 'Phone Number', placeholder: '+977 9800000000', type: 'tel' },
    { name: 'date_of_birth', label: 'Date of Birth', placeholder: '', type: 'date' },
    { name: 'bio', label: 'Bio', placeholder: 'Tell us about yourself...', type: 'textarea' },
    { name: 'portfolio_url', label: 'Portfolio URL', placeholder: 'https://your-portfolio.com', type: 'url' },
    { name: 'linkedin_url', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/you', type: 'url' },
    { name: 'github_url', label: 'GitHub URL', placeholder: 'https://github.com/you', type: 'url' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--color-bg-card)] rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--color-border)]"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-black text-[var(--color-text-primary)]">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--color-muted)] rounded-lg">
            <X size={20} />
          </button>
        </div>
        {subtitle && <p className="text-sm text-[var(--color-text-secondary)] mb-6">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}

        <div className="space-y-5">
          {fields.map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label className="block text-sm font-bold mb-2 text-[var(--color-text-secondary)]">{label}</label>
              {type === 'textarea' ? (
                <textarea
                  name={name}
                  value={formData[name] || ''}
                  onChange={onChange}
                  rows={4}
                  className={inputClass}
                  placeholder={placeholder}
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name] || ''}
                  onChange={onChange}
                  className={inputClass}
                  placeholder={placeholder}
                />
              )}
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" fullWidth onClick={onClose}>Cancel</Button>
            <Button variant="primary" fullWidth onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}