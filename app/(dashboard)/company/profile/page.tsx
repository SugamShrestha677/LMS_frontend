'use client';

import { useCompanyProfile } from '@/lib/hooks/useCompanyData';
import { useAuthStore } from '@/lib/store/authStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { 
  Building2, Mail, Globe, MapPin, 
  Users, Briefcase, Star, Edit, 
  Camera, PlusCircle, ExternalLink, ShieldCheck, ChevronRight
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function CompanyProfile() {
  const { user } = useAuthStore();
  const { data: profile, isLoading } = useCompanyProfile();

  if (isLoading) return <div className="p-8"><Skeleton className="h-96 w-full" rounded="lg" /></div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Profile Header */}
      <Card className="p-0 overflow-hidden border-white/50 shadow-card">
        <div className="h-40 bg-gradient-to-r from-[#0A5C4A] to-[#1E88E5] relative">
          <button className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-colors backdrop-blur-md">
            <Edit size={16} />
          </button>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex flex-col md:flex-row md:items-end gap-6 -mt-16">
            <div className="relative group">
              <div className="w-40 h-40 rounded-3xl bg-white p-2 shadow-xl border border-gray-100">
                <div className="w-full h-full rounded-2xl bg-gray-50 flex items-center justify-center text-[#0A5C4A] font-black text-5xl">
                  {getInitials('Leapfrog Tech')}
                </div>
              </div>
              <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[#0A5C4A] text-white flex items-center justify-center border-4 border-white shadow-lg hover:scale-110 transition-transform">
                <Camera size={18} />
              </button>
            </div>
            
            <div className="flex-1 space-y-2 mb-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-black text-[#1E1E2A]">Leapfrog Tech</h1>
                <Badge variant="primary" size="md" dot>Enterprise Partner</Badge>
              </div>
              <p className="text-[#5A5A6E] font-medium flex items-center gap-2">
                Empowering the next generation of Nepali tech talent.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-xs text-[#9ca3af] font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><MapPin size={12} /> Kathmandu, Nepal</span>
                <span className="flex items-center gap-1.5"><Globe size={12} /> leapfrog.technology</span>
                <span className="flex items-center gap-1.5"><Users size={12} /> 500+ Employees</span>
              </div>
            </div>

            <div className="flex gap-2 mb-2">
              <Button className="h-11 shadow-primary">
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Stats & Info */}
        <div className="lg:col-span-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 text-center">
              <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider mb-1">Open Positions</p>
              <p className="text-3xl font-black text-[#0A5C4A]">12</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider mb-1">Students Hired</p>
              <p className="text-3xl font-black text-[#F5A623]">45</p>
            </Card>
            <Card className="p-6 text-center">
              <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider mb-1">Partner Since</p>
              <p className="text-3xl font-black text-[#1E88E5]">2022</p>
            </Card>
          </div>

          <Card className="p-8">
            <h3 className="text-xl font-bold text-[#1E1E2A] mb-6 flex items-center gap-2">
              <Building2 size={20} className="text-[#0A5C4A]" /> Company Overview
            </h3>
            <div className="space-y-4 text-[#5A5A6E] text-sm leading-relaxed">
              <p>
                Leapfrog Tech is a leading technology company based in Kathmandu, Nepal, specializing 
                in building innovative software solutions for global clients. We believe in 
                fostering talent and bridging the gap between local education and international 
                industry standards.
              </p>
              <p>
                Through Leapfrog Connect, we identify high-potential students early in their 
                learning journey, provide mentorship, and offer direct career paths based on 
                verified skills and assessments.
              </p>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-[#1E1E2A] flex items-center gap-2">
                <Briefcase size={20} className="text-[#0A5C4A]" /> Recent Job Postings
              </h3>
              <Button variant="ghost" size="sm" className="text-[#0A5C4A] font-bold">
                View All <ExternalLink size={14} className="ml-1.5" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Senior React Dev', type: 'Full-time', apps: 42, match: 5 },
                { title: 'Backend Intern', type: 'Internship', apps: 156, match: 28 },
                { title: 'QA Engineer', type: 'Contract', apps: 12, match: 2 },
              ].map((job, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-gray-100 flex items-center justify-between hover:bg-gray-50 transition-all cursor-pointer">
                  <div>
                    <h4 className="font-bold text-[#1E1E2A]">{job.title}</h4>
                    <p className="text-xs text-[#5A5A6E]">{job.type} • {job.apps} Applications</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm" dot>{job.match} High Matches</Badge>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              ))}
              <Button variant="outline" fullWidth className="border-dashed border-2 py-6">
                <PlusCircle size={20} className="mr-2" /> Post New Position
              </Button>
            </div>
          </Card>
        </div>

        {/* Right: Security & Settings */}
        <div className="space-y-8">
          <Card className="p-6 bg-[#FAFAFA] border-dashed border-2 border-gray-200">
            <h3 className="font-bold text-lg text-[#1E1E2A] mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#0A5C4A]" /> Verification Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A6E]">Email Verified</span>
                <Badge variant="success" size="sm">YES</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A6E]">Tax Clearance</span>
                <Badge variant="success" size="sm">YES</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#5A5A6E]">Company Reg.</span>
                <Badge variant="success" size="sm">YES</Badge>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <p className="text-[10px] text-[#9ca3af] font-bold uppercase">Last Audit: April 15, 2024</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg text-[#1E1E2A] mb-4 flex items-center gap-2">
              <Star size={18} className="text-amber-500" /> Hiring Stats
            </h3>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-[#5A5A6E] mb-1.5">
                  <span>Interview Conversion</span>
                  <span>78%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-[78%] rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-[#5A5A6E] mb-1.5">
                  <span>Offer Acceptance</span>
                  <span>92%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#0A5C4A] w-[92%] rounded-full" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-[#1E1E2A] text-white">
            <h4 className="font-black text-xl mb-2">Connect Recruiter</h4>
            <p className="text-white/60 text-xs mb-6">
              You are currently using the <span className="text-[#F5A623] font-bold">Pro Plan</span>. 
              Renew in 12 days to maintain access to the full talent pool.
            </p>
            <Button variant="secondary" fullWidth className="bg-[#F5A623] border-none text-[#1E1E2A] hover:bg-[#e8961a]">
              Manage Subscription
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
