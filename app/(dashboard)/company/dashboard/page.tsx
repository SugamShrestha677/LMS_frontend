'use client';

import { useCompanyDashboard } from '@/lib/hooks/useCompanyData';
import { useAuthStore } from '@/lib/store/authStore';
import { StatCard, Card } from '@/components/ui/Card';
import { Badge, ProgressBar } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { motion } from 'framer-motion';
import { 
  Users, Briefcase, UserCheck, Star, Award,
  Search, Filter, MapPin, ExternalLink,
  PlusCircle, TrendingUp, Mail
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function CompanyDashboard() {
  const { user } = useAuthStore();
  const { data: dashboard, isLoading } = useCompanyDashboard();

  if (isLoading) return <DashboardSkeleton />;

  const topCandidates = dashboard?.top_candidates ?? [
    { id: 1, name: 'Sita Sharma', role: 'Fullstack Developer', score: 94, location: 'Kathmandu', badges: 8 },
    { id: 2, name: 'Ram Bahadur', role: 'Python Engineer', score: 88, location: 'Lalitpur', badges: 6 },
    { id: 3, name: 'Maya Tamang', role: 'UI/UX Designer', score: 85, location: 'Pokhara', badges: 5 },
  ];

  const recentApps = dashboard?.recent_applications ?? [
    { id: 10, candidate: 'Hari Prasad', job: 'Senior React Dev', date: '2024-04-28', status: 'Pending' },
    { id: 11, candidate: 'Anita Rai', job: 'Backend Intern', date: '2024-04-27', status: 'Shortlisted' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="text-3xl font-black text-[#1E1E2A]">
            Welcome, <span className="text-[#0A5C4A]">{user?.first_name}</span> from <span className="text-[#F5A623]">Leapfrog Tech</span>
          </h1>
          <p className="text-[#5A5A6E] mt-1">Your talent pipeline is growing. 12 new matches today.</p>
        </motion.div>
        
        <div className="flex items-center gap-3">
          <Link href="/company/jobs/new">
            <Button size="md" className="h-11">
              <PlusCircle size={18} className="mr-2" /> Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Jobs"
          value={dashboard?.stats?.active_jobs ?? 8}
          icon={<Briefcase size={20} />}
          change="2 ending soon"
          changePositive={false}
          color="#0A5C4A"
        />
        <StatCard
          title="Total Candidates"
          value={dashboard?.stats?.total_candidates ?? 156}
          icon={<Users size={20} />}
          change="+12% this week"
          changePositive={true}
          color="#1E88E5"
        />
        <StatCard
          title="Shortlisted"
          value={dashboard?.stats?.shortlisted ?? 24}
          icon={<Star size={20} />}
          change="5 scheduled for interview"
          changePositive={true}
          color="#F5A623"
        />
        <StatCard
          title="Placement Rate"
          value={dashboard?.stats?.placement_rate ?? '92%'}
          icon={<TrendingUp size={20} />}
          change="Top 5% in category"
          changePositive={true}
          color="#7C3AED"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Top Candidates (Main Section) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-[#1E1E2A]">Recommended Talent</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-9 px-3 border border-[#e5e7eb] bg-white">
                <Filter size={14} className="mr-2" /> Filter
              </Button>
              <Link href="/company/talent-pool" className="text-sm font-bold text-[#0A5C4A] hover:underline">
                View All
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {topCandidates.map((candidate, idx) => (
              <motion.div
                key={candidate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card hover className="p-0 overflow-hidden flex flex-col sm:flex-row group">
                  <div className="p-6 flex-1 flex flex-col sm:flex-row gap-6">
                    {/* Avatar & Initials */}
                    <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-[#0A5C4A] font-black text-xl flex-shrink-0 group-hover:scale-105 transition-transform">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    
                    {/* Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-[#1E1E2A] text-lg">{candidate.name}</h4>
                          <p className="text-sm text-[#5A5A6E] font-medium">{candidate.role}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-black text-[#0A5C4A] uppercase tracking-tighter">Match Score</p>
                          <p className="text-2xl font-black text-[#0A5C4A]">{candidate.score}%</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 pt-1">
                        <div className="flex items-center gap-1.5 text-xs text-[#5A5A6E]">
                          <MapPin size={14} /> {candidate.location}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#5A5A6E]">
                          <Award size={14} /> {candidate.badges} Verified Badges
                        </div>
                      </div>

                      <div className="pt-2">
                        <ProgressBar value={candidate.score} color="#0A5C4A" />
                      </div>
                    </div>
                  </div>

                  {/* Action Sidebar on Card */}
                  <div className="bg-[#FAFAFA] border-t sm:border-t-0 sm:border-l border-[#e5e7eb] p-4 flex sm:flex-col justify-center gap-2">
                    <Button variant="primary" size="sm" className="h-9 flex-1 sm:flex-none">
                      <Star size={14} className="mr-1.5" /> Shortlist
                    </Button>
                    <Button variant="outline" size="sm" className="h-9 flex-1 sm:flex-none bg-white">
                      View Profile
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Applications Sidebar */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-[#1E1E2A]">Recent Applications</h3>
          </div>
          
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-[#e5e7eb]">
              {recentApps.map((app) => (
                <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-[#1E1E2A] text-sm">{app.candidate}</p>
                    <Badge variant={app.status === 'Shortlisted' ? 'success' : 'default'} size="sm">
                      {app.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-[#5A5A6E] mb-2">{app.job}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#9ca3af] font-medium">{formatDate(app.date)}</span>
                    <button className="text-[10px] font-black text-[#0A5C4A] hover:underline flex items-center gap-0.5">
                      REVIEW <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-gray-50 text-center border-t border-[#e5e7eb]">
              <button className="text-xs font-bold text-[#5A5A6E] hover:text-[#1E1E2A]">
                View All Applications
              </button>
            </div>
          </Card>

          <Card className="p-6 bg-[#0A5C4A] text-white overflow-hidden relative group">
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            <h4 className="font-black text-xl mb-2 relative z-10">Talent Search</h4>
            <p className="text-white/70 text-sm mb-6 relative z-10">
              Need a specific skill? Use our AI-powered search to find the perfect match.
            </p>
            <div className="relative z-10">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
                <input 
                  type="text" 
                  placeholder="e.g. React, Python"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-2 pl-10 pr-4 text-sm placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-dashed border-2 border-[#F5A623]/30 bg-[#F5A623]/5">
            <div className="flex items-center gap-3 mb-3 text-[#F5A623]">
              <UserCheck size={20} />
              <h4 className="font-bold">Pending Interviews</h4>
            </div>
            <p className="text-xs text-[#5A5A6E] mb-4">
              You have <span className="font-bold">3 candidates</span> waiting for interview scheduling.
            </p>
            <Button variant="secondary" size="sm" fullWidth className="h-9">
              Schedule Now
            </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
