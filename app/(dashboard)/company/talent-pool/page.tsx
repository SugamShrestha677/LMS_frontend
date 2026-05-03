'use client';

import { useTalentPool } from '@/lib/hooks/useCompanyData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, MapPin, 
  Award, GraduationCap, Star, UserPlus,
  Mail, MessageSquare, ChevronRight, SlidersHorizontal
} from 'lucide-react';
import { useState } from 'react';
import { getInitials } from '@/lib/utils';

export default function TalentPool() {
  const [filters, setFilters] = useState({});
  const { data: candidates, isLoading } = useTalentPool(filters);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const displayCandidates = candidates ?? [
    { 
      id: 1, 
      name: 'Prabhat Gurung', 
      role: 'Full Stack Developer', 
      location: 'Kathmandu', 
      match_score: 96,
      badges: ['React Expert', 'Django Master', 'AWS Certified'],
      education: 'BSc. CSIT, IOE',
      experience: '2+ Years'
    },
    { 
      id: 2, 
      name: 'Sunita Thapa', 
      role: 'Data Scientist', 
      location: 'Pokhara (Remote)', 
      match_score: 89,
      badges: ['Python Pro', 'TensorFlow', 'SQL Expert'],
      education: 'MSc. Data Science',
      experience: '1 Year'
    },
    { 
      id: 3, 
      name: 'Rohan Shrestha', 
      role: 'UI Designer', 
      location: 'Lalitpur', 
      match_score: 82,
      badges: ['Figma Pro', 'Design Systems'],
      education: 'BFA, Kathmandu University',
      experience: '3+ Years'
    },
    { 
      id: 4, 
      name: 'Deepa Rai', 
      role: 'Frontend Dev', 
      location: 'Kathmandu', 
      match_score: 75,
      badges: ['React Expert', 'Tailwind CSS'],
      education: 'BE Computer, Pulchowk',
      experience: 'Intern'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E2A]">Talent <span className="text-gradient">Pool</span></h1>
          <p className="text-[#5A5A6E] mt-1">Discover verified students and professionals for your team.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 bg-white">
            <SlidersHorizontal size={18} className="mr-2" /> Advanced Filters
          </Button>
          <Button className="h-11 shadow-primary">
            <UserPlus size={18} className="mr-2" /> Bulk Shortlist
          </Button>
        </div>
      </div>

      {/* Search & Stats Bar */}
      <Card className="p-4 bg-white/50 border-white/80 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-6 items-center">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5A6E]" />
            <input
              type="text"
              placeholder="Search by name, role, skills, or badges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border-[#e5e7eb] focus:ring-2 focus:ring-[#0A5C4A] focus:border-transparent outline-none bg-white text-sm"
            />
          </div>
          
          <div className="flex items-center gap-8 px-4 border-l border-gray-200 hidden lg:flex">
            <div>
              <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider">Total Talent</p>
              <p className="text-lg font-black text-[#1E1E2A]">1,245</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider">Verified</p>
              <p className="text-lg font-black text-[#0A5C4A]">856</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider">Matches</p>
              <p className="text-lg font-black text-[#F5A623]">24</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Talent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {isLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-64 w-full" rounded="lg" />)
          ) : displayCandidates.map((candidate, idx) => (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
            >
              <Card hover className="p-0 overflow-hidden group border-white/40 shadow-card">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      {/* Avatar */}
                      <div className="w-14 h-14 rounded-2xl bg-[#0A5C4A]/5 border border-[#0A5C4A]/10 flex items-center justify-center text-[#0A5C4A] font-black text-xl group-hover:scale-110 transition-transform">
                        {getInitials(candidate.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1E1E2A] text-lg flex items-center gap-2">
                          {candidate.name}
                          <Badge variant="success" size="sm" dot pulse>Verified</Badge>
                        </h3>
                        <p className="text-sm font-medium text-[#5A5A6E]">{candidate.role}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">
                            <MapPin size={10} /> {candidate.location}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">
                            <GraduationCap size={10} /> {candidate.experience}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="w-12 h-12 rounded-full border-4 border-[#0A5C4A]/10 flex items-center justify-center relative">
                        <span className="text-sm font-black text-[#0A5C4A]">{candidate.match_score}</span>
                        {/* Simple SVG ring for progress */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="24" cy="24" r="20"
                            stroke="#0A5C4A"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray={125.6}
                            strokeDashoffset={125.6 * (1 - candidate.match_score / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <p className="text-[10px] font-black text-[#5A5A6E] mt-1">MATCH</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-[#5A5A6E] uppercase tracking-wider mb-2">Verified Badges</p>
                      <div className="flex flex-wrap gap-2">
                        {candidate.badges.map(badge => (
                          <Badge key={badge} variant="primary" size="sm">{badge}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <Button size="sm" className="flex-1 h-10 shadow-primary">
                        <Star size={14} className="mr-1.5 fill-current" /> Shortlist
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 h-10 bg-white">
                        <Mail size={14} className="mr-1.5" /> Message
                      </Button>
                      <Button variant="ghost" size="sm" className="w-10 h-10 p-0 border border-[#e5e7eb] bg-white">
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
