'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Clock, FileText, Play, AlertCircle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

const upcomingAssessments = [
  {
    id: 1,
    title: 'Advanced React Concepts',
    course: 'Full Stack Web Development',
    duration: '45 mins',
    questions: 30,
    dueDate: '2024-05-02',
    status: 'pending',
    urgency: 'high'
  },
  {
    id: 2,
    title: 'Node.js & Express API',
    course: 'Backend Systems',
    duration: '60 mins',
    questions: 25,
    dueDate: '2024-05-10',
    status: 'pending',
    urgency: 'medium'
  }
];

const completedAssessments = [
  {
    id: 3,
    title: 'HTML & CSS Fundamentals',
    course: 'Web Basics',
    score: 92,
    date: '2024-04-15',
    status: 'completed'
  },
  {
    id: 4,
    title: 'JavaScript Essentials',
    course: 'Web Basics',
    score: 85,
    date: '2024-04-01',
    status: 'completed'
  }
];

export default function AssessmentsPage() {
  return (
    <div className="space-y-10 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm" dot pulse>Live Evaluations</Badge>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">Academic Assessments</h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">Verify your skills and unlock new industry opportunities.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Clock size={22} />
              </div>
              <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Active Deadlines</h2>
            </div>
            
            <div className="space-y-4">
              {upcomingAssessments.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, type: 'spring' }}
                >
                  <Card className={`p-8 border-l-4 ${item.urgency === 'high' ? 'border-red-500 bg-red-500/[0.02]' : 'border-[var(--color-primary)] bg-[var(--color-primary)]/[0.02]'}`}>
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">{item.title}</h3>
                          {item.urgency === 'high' && (
                            <Badge variant="danger" size="sm" pulse>Critical</Badge>
                          )}
                        </div>
                        <p className="text-sm font-bold text-[var(--color-text-secondary)]">{item.course}</p>
                        <div className="flex flex-wrap items-center gap-6 pt-2">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                            <Clock size={14} className="text-[var(--color-primary)]" /> {item.duration}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)]">
                            <FileText size={14} className="text-[var(--color-primary)]" /> {item.questions} Questions
                          </div>
                          <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${item.urgency === 'high' ? 'text-red-500' : 'text-[var(--color-text-secondary)]'}`}>
                            <AlertCircle size={14} /> Due: {formatDate(item.dueDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Button variant={item.urgency === 'high' ? 'danger' : 'primary'} size="lg" className="gap-2 group shadow-lg min-w-[160px]">
                          Begin Exam <Play size={18} className="fill-current group-hover:scale-110 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                <CheckCircle2 size={22} />
              </div>
              <h2 className="text-2xl font-black text-[var(--color-text-primary)] tracking-tight">Academic History</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedAssessments.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card hover className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 shadow-inner">
                        <ClipboardCheck size={24} />
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-green-600 font-mono">{item.score}%</span>
                        <p className="text-[10px] uppercase font-black text-[var(--color-text-secondary)] tracking-widest mt-1">Final Grade</p>
                      </div>
                    </div>
                    <h3 className="font-black text-lg text-[var(--color-text-primary)] mb-1 leading-tight">{item.title}</h3>
                    <p className="text-xs font-bold text-[var(--color-text-secondary)] mb-6">{item.course}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                      <span className="text-[10px] font-black text-[var(--color-text-secondary)] uppercase tracking-widest">{formatDate(item.date)}</span>
                      <button className="text-xs font-black text-[var(--color-primary)] flex items-center gap-1 hover:opacity-80 transition-opacity uppercase tracking-widest">
                        Analytics <ChevronRight size={14} />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <Card className="p-8 border-dashed border-2 border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5">
            <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 tracking-tight flex items-center gap-2">
              <AlertCircle size={20} className="text-[var(--color-primary)]" /> Exam Protocols
            </h3>
            <ul className="space-y-6">
              {[
                'Read all technical requirements before initiating.',
                'Stable low-latency connection is mandatory.',
                'The session timer remains active until submission.',
                'Minimum accreditation threshold is 75%.'
              ].map((text, i) => (
                <li key={i} className="flex gap-4 text-sm font-medium text-[var(--color-text-secondary)] leading-relaxed">
                  <div className="w-6 h-6 rounded-lg bg-[var(--color-primary)] text-white flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                    {i + 1}
                  </div>
                  {text}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)]/10 flex items-center justify-center text-[var(--color-secondary)]">
                <Zap size={22} />
              </div>
              <h3 className="font-black text-xl text-[var(--color-text-primary)] tracking-tight">Performance Benchmarks</h3>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                  <span className="text-[var(--color-text-secondary)]">System Average</span>
                  <span className="text-[var(--color-primary)]">88%</span>
                </div>
                <ProgressBar value={88} color="var(--color-primary)" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-loose font-medium">
                Your current aptitude rating is higher than <span className="font-black text-[var(--color-primary)]">92%</span> of active users in your engineering cohort.
              </p>
              <Button variant="outline" fullWidth size="lg" className="rounded-xl font-black uppercase text-[10px] tracking-widest">
                Detailed Proficiency Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
