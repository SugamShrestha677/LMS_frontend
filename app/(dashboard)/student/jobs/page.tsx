'use client';

import { useStudentJobs } from '@/lib/hooks/useStudentData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, MapPin, DollarSign, Clock, 
  Search, Filter, ChevronRight, Star,
  ShieldCheck, Zap, ArrowUpRight
} from 'lucide-react';
import { useState } from 'react';
import { formatDate } from '@/lib/utils';

export default function StudentJobs() {
  type JobItem = {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    match: number;
    posted: string;
    required_badges: string[];
  };

  const { data: jobs, isLoading } = useStudentJobs() as {
    data: JobItem[] | undefined;
    isLoading: boolean;
  };
  const [filterMode, setFilterMode] = useState<'all' | 'matched'>('matched');

  // Mock matched jobs logic for demonstration
  const displayJobs: JobItem[] = jobs ?? [
    { 
      id: 1, 
      title: 'Senior Frontend Engineer', 
      company: 'Leapfrog Tech', 
      location: 'Kathmandu (Remote)', 
      salary: 'रू 1.5L - 2.5L', 
      type: 'Full-time',
      match: 98,
      posted: '2024-04-28',
      required_badges: ['React Expert', 'TypeScript Master']
    },
    { 
      id: 2, 
      title: 'Python Backend Developer', 
      company: 'LogPoint', 
      location: 'Lalitpur', 
      salary: 'रू 1.2L - 1.8L', 
      type: 'Full-time',
      match: 85,
      posted: '2024-04-27',
      required_badges: ['Python Pro', 'System Design']
    },
    { 
      id: 3, 
      title: 'UI/UX Designer', 
      company: 'Fusemachines', 
      location: 'Kathmandu', 
      salary: 'रू 80k - 1.2L', 
      type: 'Contract',
      match: 45,
      posted: '2024-04-25',
      required_badges: ['Figma Pro']
    }
  ];

  const filteredJobs: JobItem[] = filterMode === 'matched' 
    ? displayJobs.filter((j: JobItem) => j.match >= 70) 
    : displayJobs;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E2A]">Career <span className="text-gradient">Opportunities</span></h1>
          <p className="text-[#5A5A6E] mt-1">Jobs curated based on your verified skills and badges.</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-[#e5e7eb] shadow-sm">
          <button
            onClick={() => setFilterMode('matched')}
            className={`flex items-center gap-2 px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              filterMode === 'matched' 
                ? 'bg-[#0A5C4A] text-white shadow-md' 
                : 'text-[#5A5A6E] hover:bg-gray-50'
            }`}
          >
            <Zap size={14} className={filterMode === 'matched' ? 'fill-current' : ''} />
            Best Matches
          </button>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              filterMode === 'all' 
                ? 'bg-[#0A5C4A] text-white shadow-md' 
                : 'text-[#5A5A6E] hover:bg-gray-50'
            }`}
          >
            All Jobs
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Quick Filters */}
        <div className="hidden lg:block space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-[#1E1E2A] mb-4">Job Type</h3>
            <div className="space-y-3">
              {['Full-time', 'Part-time', 'Contract', 'Internship'].map(type => (
                <label key={type} className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#0A5C4A] focus:ring-[#0A5C4A]" />
                  <span className="text-sm text-[#5A5A6E] group-hover:text-[#1E1E2A] transition-colors">{type}</span>
                </label>
              ))}
            </div>

            <h3 className="font-bold text-[#1E1E2A] mt-8 mb-4">Salary Range</h3>
            <div className="space-y-4">
              <input type="range" className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#0A5C4A]" />
              <div className="flex justify-between text-xs font-bold text-[#5A5A6E]">
                <span>रू 20k</span>
                <span>रू 300k+</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-[#0A5C4A] to-[#0d7a63] text-white">
            <ShieldCheck size={32} className="mb-4 text-white/50" />
            <h4 className="font-bold text-lg mb-2">Connect Verified</h4>
            <p className="text-white/70 text-xs leading-relaxed mb-4">
              Employers on Connect prioritize candidates with verified badges. Your applications are <span className="text-white font-black">3x more likely</span> to get reviewed.
            </p>
            <Button variant="secondary" size="sm" fullWidth className="text-[#1E1E2A]">
              Optimize Profile
            </Button>
          </Card>
        </div>

        {/* Job List */}
        <div className="lg:col-span-3 space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="p-6">
                  <div className="flex gap-4">
                    <Skeleton className="w-16 h-16" rounded="lg" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-6 w-20" rounded="full" />
                        <Skeleton className="h-6 w-20" rounded="full" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : filteredJobs.map((job, idx) => (
              <motion.div
                key={job.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <Card hover className="p-0 overflow-hidden group">
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    {/* Company Logo Placeholder */}
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-[#e5e7eb] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Briefcase size={28} className="text-[#0A5C4A]" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xl font-bold text-[#1E1E2A] group-hover:text-[#0A5C4A] transition-colors truncate">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-[#5A5A6E]">
                            <span className="hover:text-[#1E1E2A] hover:underline cursor-pointer">{job.company}</span>
                            <span className="text-gray-300">•</span>
                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                          </div>
                        </div>
                        
                        {job.match >= 90 && (
                          <Badge variant="success" pulse size="md" className="md:self-start">
                            <Star size={12} className="fill-current mr-1" /> Perfect Match
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3 py-2">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A5A6E] bg-gray-100 px-2.5 py-1.5 rounded-lg">
                          <DollarSign size={14} /> {job.salary}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A5A6E] bg-gray-100 px-2.5 py-1.5 rounded-lg">
                          <Clock size={14} /> {formatDate(job.posted)}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[#5A5A6E] bg-gray-100 px-2.5 py-1.5 rounded-lg">
                          <Briefcase size={14} /> {job.type}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider mr-2 self-center">Required Badges:</span>
                        {job.required_badges.map(badge => (
                          <Badge key={badge} variant="primary" size="sm" dot>{badge}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="md:border-l border-[#e5e7eb] md:pl-6 flex flex-row md:flex-col justify-center items-center gap-3">
                      <div className="text-center hidden md:block">
                        <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-tighter">Match Score</p>
                        <p className={`text-2xl font-black ${job.match >= 80 ? 'text-[#0A5C4A]' : 'text-amber-500'}`}>
                          {job.match}%
                        </p>
                      </div>
                      <Button size="md" className="w-full md:w-32 h-11">
                        Apply <ArrowUpRight size={16} className="ml-1.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {!isLoading && (
            <div className="pt-4 text-center">
              <Button variant="ghost" className="text-[#5A5A6E]">
                Load More Jobs
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
