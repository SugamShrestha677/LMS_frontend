'use client';

import { motion } from 'framer-motion';
import { Award, Lock, Zap, Target, Star, ShieldCheck, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';

const badgeCategories = ['All', 'Verified', 'Technical', 'Soft Skills', 'Achievement'];

const mockBadges = [
  {
    id: 1,
    name: 'Quick Learner',
    description: 'Completed 5 lessons in a single day.',
    icon: <Zap size={28} />,
    category: 'Achievement',
    isUnlocked: true,
    isVerified: true,
    unlockedDate: '2024-04-10',
    color: 'amber'
  },
  {
    id: 2,
    name: 'React Architect',
    description: 'Mastered advanced React design patterns.',
    icon: <Target size={28} />,
    category: 'Technical',
    isUnlocked: true,
    isVerified: true,
    unlockedDate: '2024-03-22',
    color: 'blue'
  },
  {
    id: 3,
    name: 'Consistency King',
    description: 'Maintained a 7-day learning streak.',
    icon: <Star size={28} />,
    category: 'Achievement',
    isUnlocked: true,
    isVerified: false,
    unlockedDate: '2024-04-25',
    color: 'purple'
  },
  {
    id: 4,
    name: 'Database Pro',
    description: 'Passed the advanced SQL assessment.',
    icon: <ShieldCheck size={28} />,
    category: 'Technical',
    isUnlocked: false,
    isVerified: true,
    color: 'green'
  },
  {
    id: 5,
    name: 'Team Player',
    description: 'Contributed to 3 group projects.',
    icon: <Award size={28} />,
    category: 'Soft Skills',
    isUnlocked: false,
    isVerified: true,
    color: 'emerald'
  }
];

export default function BadgesPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredBadges = mockBadges.filter(badge => {
    const matchesSearch = badge.name.toLowerCase().includes(search.toLowerCase());
    if (filter === 'All') return matchesSearch;
    if (filter === 'Verified') return matchesSearch && badge.isVerified;
    return matchesSearch && badge.category === filter;
  });

  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm">Achievement System</Badge>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Competency Badges</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Earn verified recognitions to validate your expertise.</p>
        </motion.div>
        
        <div className="relative w-full md:w-80">
          <Input
            placeholder="Filter achievements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 rounded-xl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={20} />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {badgeCategories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              filter === cat 
                ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20' 
                : 'bg-[var(--color-muted)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:bg-[var(--color-border)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredBadges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05, type: 'spring' }}
          >
            <Card className={`p-8 h-full flex flex-col items-center text-center relative group overflow-hidden ${!badge.isUnlocked ? 'grayscale opacity-60' : ''}`}>
              {!badge.isUnlocked && (
                <div className="absolute top-6 right-6 text-[var(--color-text-secondary)] opacity-40">
                  <Lock size={20} />
                </div>
              )}
              
              {badge.isVerified && (
                <div className="absolute top-6 left-6">
                  <Badge variant="success" size="sm" dot>Verified</Badge>
                </div>
              )}

              <div className={`w-24 h-24 rounded-[2rem] mb-8 flex items-center justify-center relative transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                badge.isUnlocked 
                  ? 'bg-[var(--color-muted)] text-[var(--color-primary)] border border-[var(--color-border)] shadow-xl shadow-black/5' 
                  : 'bg-[var(--color-muted)]/50 text-[var(--color-text-secondary)] border border-[var(--color-border)]/50'
              }`}>
                {badge.icon}
                {badge.isUnlocked && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-2 -right-2 w-8 h-8 bg-[var(--color-bg-card)] rounded-xl flex items-center justify-center shadow-lg border border-[var(--color-border)]"
                  >
                    <div className="w-5 h-5 bg-green-500 rounded-lg flex items-center justify-center text-white">
                      <ShieldCheck size={12} />
                    </div>
                  </motion.div>
                )}
              </div>

              <h3 className={`font-black text-xl mb-3 tracking-tight ${badge.isUnlocked ? 'text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'}`}>
                {badge.name}
              </h3>
              <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-8 flex-1 leading-relaxed">
                {badge.description}
              </p>

              <div className="w-full pt-6 border-t border-[var(--color-border)]">
                {badge.isUnlocked ? (
                  <>
                    <p className="text-[10px] uppercase font-black text-[var(--color-text-secondary)] mb-4 tracking-widest">
                      Unlocked {badge.unlockedDate}
                    </p>
                    <Button variant="outline" size="md" fullWidth className="rounded-xl">
                      Share Credential
                    </Button>
                  </>
                ) : (
                  <Button variant="primary" size="md" fullWidth className="opacity-50 cursor-not-allowed grayscale rounded-xl">
                    Locked Achievement
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
