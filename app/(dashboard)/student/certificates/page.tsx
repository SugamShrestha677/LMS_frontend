'use client';

import { motion } from 'framer-motion';
import { Award, Download, ExternalLink, Search, FileText, Share2, Plus } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

const mockCertificates = [
  {
    id: 1,
    title: 'Full Stack Web Development',
    issuer: 'Leapfrog Academy',
    date: '2024-03-15',
    credentialId: 'LF-CERT-2024-001',
    skills: ['React', 'Node.js', 'PostgreSQL', 'Docker']
  },
  {
    id: 2,
    title: 'Advanced UI/UX Design',
    issuer: 'Leapfrog Academy',
    date: '2024-02-10',
    credentialId: 'LF-CERT-2024-042',
    skills: ['Figma', 'Prototyping', 'User Research']
  },
  {
    id: 3,
    title: 'Data Science with Python',
    issuer: 'Leapfrog Academy',
    date: '2023-11-28',
    credentialId: 'LF-CERT-2023-156',
    skills: ['Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib']
  }
];

export default function CertificatesPage() {
  const [search, setSearch] = useState('');
  const { user } = useAuthStore();

  const filteredCerts = mockCertificates.filter(cert => 
    cert.title.toLowerCase().includes(search.toLowerCase()) ||
    cert.issuer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm">Academic Credentials</Badge>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Verified Certificates</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Manage and share your industry-recognized certifications.</p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full md:w-72">
            <Input
              placeholder="Search certificates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" size={18} />
          </div>
          <Button variant="primary" size="lg" className="h-12 shadow-primary">
            <Share2 size={18} className="mr-2" /> Share Portfolio
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCerts.map((cert, idx) => (
          <motion.div
            key={cert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card hover className="p-8 h-full flex flex-col group">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)] mb-6 shadow-inner group-hover:scale-110 transition-transform">
                <FileText size={28} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-xl text-[var(--color-text-primary)] leading-tight">{cert.title}</h3>
                </div>
                <p className="text-sm font-bold text-[var(--color-text-secondary)] mb-6">{cert.issuer}</p>
                
                <div className="flex flex-wrap gap-2 mb-8">
                  {cert.skills.map(skill => (
                    <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-[var(--color-border)]">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                    <span>Issued Date</span>
                    <span className="text-[var(--color-text-primary)]">{formatDate(cert.date)}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                    <span>Credential ID</span>
                    <span className="text-[var(--color-text-primary)] font-mono">{cert.credentialId}</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <Button variant="outline" size="md" className="flex-1 rounded-xl">
                  View Online
                </Button>
                <Button variant="primary" size="md" className="px-4 rounded-xl">
                  <Download size={18} />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: filteredCerts.length * 0.1 }}
        >
          <Card className="h-full border-dashed border-2 border-[var(--color-border)] bg-[var(--color-muted)]/30 flex flex-col items-center justify-center text-center p-8 group cursor-pointer hover:bg-[var(--color-muted)] transition-colors min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-[var(--color-bg-card)] flex items-center justify-center text-[var(--color-text-secondary)] mb-4 shadow-sm border border-[var(--color-border)] group-hover:scale-110 transition-transform">
              <Plus size={32} />
            </div>
            <h4 className="font-black text-lg text-[var(--color-text-primary)] mb-1">Add External Certificate</h4>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Manual entry or upload</p>
          </Card>
        </motion.div>
      </div>

      {filteredCerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-[var(--color-text-secondary)] mb-4">
            <Award size={40} />
          </div>
          <h3 className="text-xl font-black text-[var(--color-text-primary)]">No certificates found</h3>
          <p className="text-[var(--color-text-secondary)] max-w-md mx-auto mt-2 font-medium">
            Try adjusting your search or complete more courses to earn verified certificates.
          </p>
          <Button variant="primary" className="mt-8" onClick={() => window.location.href = '/student/courses'}>
            Browse Courses
          </Button>
        </div>
      )}

      <Card className="p-10 bg-[var(--color-primary)] text-white border-none overflow-hidden relative group mt-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
            <Award size={40} className="text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight mb-2">Automated Verification</h2>
            <p className="text-white/70 font-medium text-lg leading-relaxed">
              Your certificates are cryptographically signed and verified on the Leapfrog Network, 
              making them immediately trusted by potential employers.
            </p>
          </div>
          <Button variant="secondary" size="lg" className="bg-white text-[var(--color-primary)] hover:bg-gray-100 font-black px-10 border-none">
            Learn More
          </Button>
        </div>
      </Card>
    </div>
  );
}
