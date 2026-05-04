'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Award, Search, Download, ExternalLink, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock certificates until backend integration
const mockCertificates = [
  {
    id: 'CERT-101-5-202405041030',
    studentName: 'Aarav Sharma',
    courseName: 'Advanced React Development',
    issuedAt: '2026-05-04T10:30:00Z',
    score: 95,
    url: '#',
  },
  {
    id: 'CERT-102-8-202405031545',
    studentName: 'Priya Thapa',
    courseName: 'Node.js & REST APIs',
    issuedAt: '2026-05-03T15:45:00Z',
    score: 88,
    url: '#',
  },
  {
    id: 'CERT-101-12-202405020915',
    studentName: 'Rajesh KC',
    courseName: 'Advanced React Development',
    issuedAt: '2026-05-02T09:15:00Z',
    score: 100,
    url: '#',
  }
];

export default function TutorCertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCertificates = mockCertificates.filter(c => 
    c.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Issued <span className="text-[var(--color-primary)]">Certificates</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            View and verify certificates issued to students who completed your courses.
          </p>
        </div>
        <Button variant="outline" size="lg" className="rounded-2xl bg-white shadow-sm border-[var(--color-border)]">
          Export Records
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6 bg-[var(--color-bg-card)]/60 border-[var(--color-border)]">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Total Issued</p>
            <p className="text-2xl font-black text-[var(--color-text-primary)]">{mockCertificates.length}</p>
          </div>
        </Card>
        <div className="md:col-span-2 relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search by student, course, or certificate ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full min-h-[72px] bg-[var(--color-bg-card)]/60 border border-[var(--color-border)] rounded-[2rem] pl-14 pr-6 outline-none focus:ring-4 focus:ring-[var(--color-primary)]/5 focus:border-[var(--color-primary)]/30 transition-all font-medium text-[var(--color-text-primary)] backdrop-blur-sm"
          />
        </div>
      </div>

      <Card padding="none" className="overflow-hidden border-none shadow-2xl bg-[var(--color-bg-card)]/60 backdrop-blur-xl rounded-[2.5rem]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--color-primary)]/5">
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Certificate Info</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Student</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Final Score</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-[var(--color-text-secondary)] font-medium">No certificates found.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredCertificates.map((cert, idx) => (
                    <motion.tr 
                      key={cert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[var(--color-primary)]/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-[var(--color-text-primary)]">{cert.courseName}</span>
                          <span className="text-[10px] text-[var(--color-text-secondary)] font-medium mt-1 flex items-center gap-2">
                            <span className="bg-[var(--color-muted)] px-2 py-0.5 rounded text-[var(--color-text-primary)] font-mono">{cert.id}</span>
                            <span className="flex items-center"><Calendar size={10} className="mr-1" /> {new Date(cert.issuedAt).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-[var(--color-text-primary)]">
                        {cert.studentName}
                      </td>
                      <td className="px-8 py-6">
                        <Badge variant="success" className="font-black text-sm px-3 py-1 bg-green-100 text-green-700 border-none">
                          {cert.score}%
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="w-10 h-10 rounded-xl hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center" title="View Certificate">
                            <ExternalLink size={18} />
                          </button>
                          <button className="w-10 h-10 rounded-xl hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all flex items-center justify-center" title="Download PDF">
                            <Download size={18} />
                          </button>
                        </div>
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
