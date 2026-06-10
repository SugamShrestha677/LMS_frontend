'use client';

import { useState } from 'react';
import { useStudentProfile } from '@/lib/hooks/useStudentData';
import { useAuthStore } from '@/lib/store/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import {
  User, Mail, Phone, MapPin,
  Award, GraduationCap, Link as LinkIcon,
  Share2, Edit, Camera, Github, Linkedin, Twitter, Star, Lock
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import axios from '@/lib/api/axios'; // adjust import to your axios instance
import { toast } from 'sonner';

// Extended profile type
interface StudentProfileData {
  program?: string;
  campus?: string;
  location?: string;
  bio?: string;
  phone?: string;
  profileSlug?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  education?: Array<{
    degree: string;
    institution: string;
    startYear: number;
    endYear?: number;
    current?: boolean;
  }>;
  skills?: Array<{
    name: string;
    percentage: number;
    color?: string;
  }>;
  badges?: Array<{
    id: number;
    name: string;
    date: string;
    icon: string;
    rarity: 'Gold' | 'Silver' | 'Bronze';
  }>;
}

export default function StudentProfile() {
  const { user } = useAuthStore();
  const { data: profile, isLoading, refetch } = useStudentProfile() as {
    data: StudentProfileData | undefined;
    isLoading: boolean;
    refetch: () => void;
  };

  // State for change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to safely extract arrays
  const education = Array.isArray(profile?.education) ? profile!.education : [];
  const skills = Array.isArray(profile?.skills) ? profile!.skills : [];
  const badges = Array.isArray(profile?.badges) ? profile!.badges : [];

  // Extract simple fields with fallbacks (show empty if not provided)
  const program = profile?.program || 'Not specified';
  const campus = profile?.campus || 'Not specified';
  const location = profile?.location || 'Not specified';
  const bio = profile?.bio || 'No bio added yet.';
  const phone = profile?.phone || 'Not provided';
  const profileSlug = profile?.profileSlug || user?.email?.split('@')[0] || 'student';
  const socialLinks = profile?.socialLinks || {};

  // Profile URL for display
  const profileUrl = `leapfrog.connect/p/${profileSlug}`;

  // Handle password change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post('/api/accounts/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      toast.success('Password changed successfully');
      setShowPasswordModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <Skeleton className="h-96 w-full" rounded="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header Card */}
      <Card className="p-0 overflow-hidden border-[var(--color-border)] shadow-[var(--shadow-lg)]">
        <div className="h-40 bg-[var(--color-primary)] relative">
          <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent" />
          <button className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all backdrop-blur-md border border-white/10">
            <Edit size={18} />
          </button>
        </div>
        <div className="px-10 pb-10">
          <div className="relative flex flex-col md:flex-row md:items-end gap-8 -mt-16">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] bg-[var(--color-bg-card)] p-2 shadow-2xl">
                <div className="w-full h-full rounded-[2.25rem] bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-primary)] font-black text-5xl border border-[var(--color-border)]">
                  {getInitials(`${user?.first_name} ${user?.last_name}`)}
                </div>
              </div>
              <button className="absolute bottom-3 right-3 w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center border-4 border-[var(--color-bg-card)] shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>

            <div className="flex-1 space-y-2 mb-2">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
                  {user?.first_name} {user?.last_name}
                </h1>
                <Badge variant="success" size="md" dot pulse>Verified Scholar</Badge>
              </div>
              <p className="text-lg text-[var(--color-text-secondary)] font-bold flex items-center gap-2">
                {program} <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" />{' '}
                <span className="text-[var(--color-text-primary)]">{campus}</span>
              </p>
              <div className="flex flex-wrap gap-5 pt-2 text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                  <MapPin size={12} className="text-[var(--color-primary)]" /> {location}
                </span>
                <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                  <Mail size={12} className="text-[var(--color-primary)]" /> {user?.email}
                </span>
                <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]">
                  <LinkIcon size={12} className="text-[var(--color-primary)]" /> {profileUrl}
                </span>
              </div>
            </div>

            <div className="flex gap-3 mb-2">
              <Button variant="outline" size="md">
                <Share2 size={18} />
              </Button>
              <Button variant="primary" size="lg">
                View Public CV
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Badges */}
        <div className="lg:col-span-2 space-y-8">
          {/* Badge Showcase */}
          <Card className="p-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner border border-amber-500/10">
                  <Award size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Skill Achievements</h3>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5">Verified competency badges</p>
                </div>
              </div>
              <Badge variant="primary" size="md">Top 5% Student</Badge>
            </div>

            {badges.length === 0 ? (
              <div className="text-center py-12 text-[var(--color-text-secondary)]">
                No badges earned yet. Complete courses to earn badges.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {badges.map((badge, idx) => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05, type: 'spring' }}
                    whileHover={{ y: -8 }}
                    className="flex flex-col items-center text-center p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-all group relative overflow-hidden"
                  >
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 relative shadow-lg group-hover:rotate-12 transition-all duration-500 ${
                      badge.rarity === 'Gold' ? 'bg-amber-500/10 text-amber-500 border-2 border-amber-500/20' :
                      badge.rarity === 'Silver' ? 'bg-slate-500/10 text-slate-500 border-2 border-slate-500/20' :
                      'bg-orange-500/10 text-orange-500 border-2 border-orange-500/20'
                    }`}>
                      <Award size={40} className="fill-current opacity-20" />
                      <Star size={24} className="absolute inset-0 m-auto fill-current" />
                    </div>
                    <p className="text-base font-black text-[var(--color-text-primary)] mb-1">{badge.name}</p>
                    <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest">{badge.rarity} Recognition</p>
                  </motion.div>
                ))}
              </div>
            )}

            <Button variant="ghost" fullWidth className="mt-10 border border-dashed border-[var(--color-border)] py-6 rounded-2xl group">
              <span className="group-hover:scale-110 transition-transform">View All Achievements</span>
            </Button>
          </Card>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8 flex items-center gap-3 tracking-tight">
                <GraduationCap size={22} className="text-[var(--color-primary)]" /> Academic History
              </h3>
              {education.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  No education history added.
                </div>
              ) : (
                <div className="space-y-8">
                  {education.map((edu, index) => (
                    <div key={index} className={`border-l-4 ${edu.current ? 'border-[var(--color-primary)]' : 'border-[var(--color-border)]'} pl-6 relative ${!edu.current ? 'opacity-60' : ''}`}>
                      <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full ${edu.current ? 'bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20' : 'bg-[var(--color-border)]'}`} />
                      <p className="text-base font-black text-[var(--color-text-primary)]">{edu.degree}</p>
                      <p className="text-sm font-bold text-[var(--color-text-secondary)] mt-0.5">{edu.institution}</p>
                      <p className={`text-[10px] mt-3 font-black tracking-widest uppercase inline-block px-2 py-1 rounded ${edu.current ? 'text-[var(--color-primary)] bg-[var(--color-primary)]/5' : 'text-[var(--color-text-secondary)] bg-[var(--color-muted)]'}`}>
                        {edu.current ? `${edu.startYear} - PRESENT` : `${edu.startYear} - ${edu.endYear}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-8">
              <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8 flex items-center gap-3 tracking-tight">
                <Star size={22} className="text-[var(--color-secondary)]" /> Skill Proficiency
              </h3>
              {skills.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-text-secondary)]">
                  No skills added yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {skills.map((skill, idx) => (
                    <ProgressBar
                      key={idx}
                      label={skill.name}
                      value={skill.percentage}
                      color={skill.color || 'var(--color-primary)'}
                    />
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Right Column: Socials, Bio & Change Password */}
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight">Biography</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-loose font-medium">
              {bio}
            </p>
            <div className="flex gap-3 mt-8">
              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm">
                  <Github size={20} />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[#0077b5] hover:text-white transition-all shadow-sm">
                  <Linkedin size={20} />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[#1da1f2] hover:text-white transition-all shadow-sm">
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </Card>

          {/* Change Password Card */}
          <Card className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Security</h3>
              <Lock size={20} className="text-[var(--color-primary)]" />
            </div>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowPasswordModal(true)}
              className="border-dashed border-2 py-6 rounded-2xl"
            >
              Change Password
            </Button>
          </Card>

          <Card className="p-8 bg-[var(--color-muted)] border-dashed border-2 border-[var(--color-border)]">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight">Registry Details</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Contact Line</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Work Email</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">{user?.email}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-10 bg-gradient-to-br from-[#121217] to-[#1E1E2A] text-white border-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/20 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[var(--color-primary)]/40 transition-all duration-500" />
            <h4 className="font-black text-2xl mb-4 tracking-tight relative z-10">Application Score</h4>
            <div className="flex items-end gap-3 mb-6 relative z-10">
              <span className="text-6xl font-black font-mono">88</span>
              <span className="text-white/40 font-bold mb-2 text-lg">/ 100</span>
            </div>
            <p className="text-white/60 text-xs mb-8 leading-relaxed relative z-10">
              Your profile algorithm score is stronger than <span className="text-white font-black">92%</span> of competing students in your engineering cohort.
            </p>
            <Button variant="primary" fullWidth size="lg" className="bg-white text-[var(--color-text-primary)] hover:bg-gray-100 border-none">
              Optimization Guide
            </Button>
          </Card>
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--color-bg-card)] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-[var(--color-border)]">
            <h2 className="text-2xl font-black mb-6 text-[var(--color-text-primary)]">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 text-[var(--color-text-secondary)]">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-[var(--color-text-secondary)]">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-[var(--color-text-secondary)]">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                  required
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  fullWidth
                  onClick={() => setShowPasswordModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}