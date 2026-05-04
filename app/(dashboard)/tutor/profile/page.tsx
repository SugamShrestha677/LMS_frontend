'use client';

import { useAuthStore } from '@/lib/store/auth-store';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { 
  User, Mail, Phone, MapPin, 
  Award, GraduationCap, Link as LinkIcon,
  Share2, Edit, Camera, Github, Linkedin, Twitter, Star, BookOpen, Users
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function TutorProfilePage() {
  const { user } = useAuthStore();

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
                   {getInitials(`${user?.first_name || ''} ${user?.last_name || ''}`)}
                </div>
              </div>
              <button className="absolute bottom-3 right-3 w-10 h-10 rounded-2xl bg-[var(--color-primary)] text-white flex items-center justify-center border-4 border-[var(--color-bg-card)] shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex-1 space-y-2 mb-2">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">{user?.first_name} {user?.last_name}</h1>
                <Badge variant="success" size="md" dot pulse>Verified Tutor</Badge>
              </div>
              <p className="text-lg text-[var(--color-text-secondary)] font-bold flex items-center gap-2">
                Senior Instructor <span className="w-1 h-1 rounded-full bg-[var(--color-border)]" /> <span className="text-[var(--color-text-primary)]">Engineering & Technology</span>
              </p>
              <div className="flex flex-wrap gap-5 pt-2 text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]"><MapPin size={12} className="text-[var(--color-primary)]" /> Kathmandu, NP</span>
                <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]"><Mail size={12} className="text-[var(--color-primary)]" /> {user?.email}</span>
                <span className="flex items-center gap-2 bg-[var(--color-muted)] px-3 py-1.5 rounded-lg border border-[var(--color-border)]"><LinkIcon size={12} className="text-[var(--color-primary)]" /> leapfrog.connect/t/{user?.first_name?.toLowerCase()}</span>
              </div>
            </div>

            <div className="flex gap-3 mb-2">
              <Button variant="outline" size="md">
                <Share2 size={18} />
              </Button>
              <Button variant="primary" size="lg">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Experience */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border border-[var(--color-border)]">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <BookOpen size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Active Courses</p>
                  <p className="text-2xl font-black text-[var(--color-text-primary)]">6</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-[var(--color-border)]">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Total Students</p>
                  <p className="text-2xl font-black text-[var(--color-text-primary)]">184</p>
                </div>
              </div>
            </Card>
            <Card className="p-6 border border-[var(--color-border)]">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Star size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">Avg Rating</p>
                  <p className="text-2xl font-black text-[var(--color-text-primary)]">4.8</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Professional Experience */}
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8 flex items-center gap-3 tracking-tight">
              <GraduationCap size={22} className="text-[var(--color-primary)]" /> Teaching Experience
            </h3>
            <div className="space-y-8">
              <div className="border-l-4 border-[var(--color-primary)]/20 pl-6 relative">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20" />
                <p className="text-base font-black text-[var(--color-text-primary)]">Senior Instructor</p>
                <p className="text-sm font-bold text-[var(--color-text-secondary)] mt-0.5">Leapfrog Connect</p>
                <p className="text-[10px] text-[var(--color-primary)] mt-3 font-black tracking-widest uppercase bg-[var(--color-primary)]/5 inline-block px-2 py-1 rounded">2023 - PRESENT</p>
              </div>
              <div className="border-l-4 border-[var(--color-border)] pl-6 relative opacity-60">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[var(--color-border)]" />
                <p className="text-base font-black text-[var(--color-text-primary)]">Software Engineer</p>
                <p className="text-sm font-bold text-[var(--color-text-secondary)] mt-0.5">Tech Solutions Ltd.</p>
                <p className="text-[10px] text-[var(--color-text-secondary)] mt-3 font-black tracking-widest uppercase bg-[var(--color-muted)] inline-block px-2 py-1 rounded">2019 - 2023</p>
              </div>
            </div>
          </Card>

        </div>

        {/* Right Column: Socials & Bio */}
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight">About Me</h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-loose font-medium">
              Experienced software engineer turned educator. I specialize in React, Node.js, and modern web architecture. 
              My goal is to bridge the gap between academic learning and industry requirements by providing practical, 
              hands-on project experience to my students.
            </p>
            <div className="flex gap-3 mt-8">
              <a href="#" className="w-12 h-12 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)] hover:text-white transition-all shadow-sm">
                <Github size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[#0077b5] hover:text-white transition-all shadow-sm">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 rounded-2xl bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[#1da1f2] hover:text-white transition-all shadow-sm">
                <Twitter size={20} />
              </a>
            </div>
          </Card>

          <Card className="p-8 bg-[var(--color-muted)] border-dashed border-2 border-[var(--color-border)]">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight">Contact Details</h3>
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-card)] border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shadow-sm">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest mb-0.5">Contact Line</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary)]">+977 9800000000</p>
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
        </div>

      </div>
    </div>
  );
}
