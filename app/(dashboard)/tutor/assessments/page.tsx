'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ClipboardCheck, Search, CheckCircle2, Clock, XCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock assessments until hooked up with backend API
const mockAssessments = [
  {
    id: 1,
    studentName: 'Aarav Sharma',
    courseName: 'Advanced React Development',
    assessmentTitle: 'React Context API Project',
    submittedAt: '2026-05-04T10:30:00Z',
    status: 'pending',
    score: null,
  },
  {
    id: 2,
    studentName: 'Priya Thapa',
    courseName: 'Node.js & REST APIs',
    assessmentTitle: 'Express Authentication Module',
    submittedAt: '2026-05-03T15:45:00Z',
    status: 'graded',
    score: 92,
  },
  {
    id: 3,
    studentName: 'Rajesh KC',
    courseName: 'Advanced React Development',
    assessmentTitle: 'Redux Toolkit Implementation',
    submittedAt: '2026-05-02T09:15:00Z',
    status: 'rejected',
    score: 45,
  }
];

export default function TutorAssessmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'graded'>('all');

  const filteredAssessments = mockAssessments.filter(a => {
    const matchesSearch = a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.assessmentTitle.toLowerCase().includes(searchTerm.toLowerCase());
    if (activeTab === 'all') return matchesSearch;
    if (activeTab === 'pending') return matchesSearch && a.status === 'pending';
    return matchesSearch && a.status === 'graded';
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="warning" className="uppercase text-[10px] tracking-widest"><Clock size={10} className="mr-1 inline"/> Pending</Badge>;
      case 'graded': return <Badge variant="success" className="uppercase text-[10px] tracking-widest"><CheckCircle2 size={10} className="mr-1 inline"/> Graded</Badge>;
      case 'rejected': return <Badge variant="danger" className="uppercase text-[10px] tracking-widest"><XCircle size={10} className="mr-1 inline"/> Rejected</Badge>;
      default: return <Badge variant="secondary" className="uppercase text-[10px] tracking-widest">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Student <span className="text-[var(--color-primary)]">Assessments</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Review submissions, grade assignments, and provide feedback.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex bg-[var(--color-muted)] p-1 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'all' ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
          >
            All Submissions
          </button>
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'pending' ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
          >
            Pending Review
          </button>
          <button 
            onClick={() => setActiveTab('graded')}
            className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'graded' ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'}`}
          >
            Graded
          </button>
        </div>
        
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search by student or assessment title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full min-h-[48px] bg-[var(--color-bg-card)]/60 border border-[var(--color-border)] rounded-2xl pl-14 pr-6 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 transition-all font-medium text-[var(--color-text-primary)] backdrop-blur-sm"
          />
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-none shadow-2xl bg-[var(--color-bg-card)]/60 backdrop-blur-xl rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary)]/5">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Student & Submission</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Course</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Status</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Score</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredAssessments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <p className="text-[var(--color-text-secondary)] font-medium">No assessments found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredAssessments.map((assessment, idx) => (
                    <motion.tr 
                      key={assessment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[var(--color-primary)]/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--color-text-primary)]">{assessment.assessmentTitle}</span>
                          <span className="text-[10px] text-[var(--color-text-secondary)] font-medium mt-1">
                            By <span className="font-bold">{assessment.studentName}</span> • Submitted on {new Date(assessment.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-bold text-[var(--color-text-secondary)]">{assessment.courseName}</span>
                      </td>
                      <td className="px-8 py-6">
                        {getStatusBadge(assessment.status)}
                      </td>
                      <td className="px-8 py-6 font-bold text-[var(--color-text-primary)]">
                        {assessment.score !== null ? `${assessment.score}%` : '-'}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Button variant={assessment.status === 'pending' ? 'primary' : 'outline'} size="sm" className="rounded-xl font-bold tracking-wide">
                          {assessment.status === 'pending' ? 'Grade Now' : 'View'}
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
