'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/Badge';
import { 
  Play, CheckCircle2, ChevronLeft, ChevronRight, 
  FileText, Download, MessageSquare, Star,
  Menu, X, Lock, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

const mockCourse = {
  id: 'react-101',
  title: 'Advanced React Patterns',
  instructor: 'Sandip Subedi',
  description: 'Master advanced React patterns including Compound Components, Render Props, and Custom Hooks.',
  total_lessons: 12,
  completed_lessons: 4,
  curriculum: [
    {
      title: 'Introduction',
      lessons: [
        { id: '1', title: 'Welcome to the Course', duration: '5:00', completed: true },
        { id: '2', title: 'Environment Setup', duration: '12:00', completed: true },
      ]
    },
    {
      title: 'Advanced Patterns',
      lessons: [
        { id: '3', title: 'Compound Components', duration: '25:00', completed: true },
        { id: '4', title: 'Control Props Pattern', duration: '18:00', completed: true },
        { id: '5', title: 'Custom Hooks Deep Dive', duration: '32:00', completed: false, active: true },
        { id: '6', title: 'Performance Optimization', duration: '22:00', completed: false, locked: true },
      ]
    }
  ]
};

export default function CoursePlayer() {
  const params = useParams();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'discussion'>('content');

  const progress = (mockCourse.completed_lessons / mockCourse.total_lessons) * 100;

  return (
    <div className="flex h-[calc(100vh-64px)] -m-4 md:-m-6 lg:-m-8 bg-white overflow-hidden">
      
      {/* Sidebar - Curriculum */}
      <AnimatePresence mode="wait">
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'circOut' }}
            className="w-80 border-r border-[#e5e7eb] flex flex-col bg-[#FAFAFA] z-20"
          >
            <div className="p-5 border-b border-[#e5e7eb] bg-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#1E1E2A]">Course Content</h3>
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[#5A5A6E]">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-[#5A5A6E]">
                  <span>Overall Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <ProgressBar value={progress} color="#0A5C4A" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-4 pt-4">
              {mockCourse.curriculum.map((section, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <h4 className="px-3 text-[10px] font-black text-[#9ca3af] uppercase tracking-widest mb-2">
                    {section.title}
                  </h4>
                  {section.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      disabled={lesson.locked}
                      className={cn(
                        "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group",
                        lesson.active ? "bg-white shadow-sm border border-[#0A5C4A]/20" : "hover:bg-gray-100",
                        lesson.locked && "opacity-50 grayscale cursor-not-allowed"
                      )}
                    >
                      <div className={cn(
                        "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                        lesson.completed ? "bg-emerald-100 text-emerald-600" : 
                        lesson.active ? "bg-[#0A5C4A] text-white" : "bg-gray-200 text-gray-500"
                      )}>
                        {lesson.completed ? <CheckCircle2 size={12} /> : 
                         lesson.locked ? <Lock size={10} /> : <Play size={10} className="fill-current" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn(
                          "text-sm font-bold truncate",
                          lesson.active ? "text-[#0A5C4A]" : "text-[#1E1E2A]"
                        )}>
                          {lesson.title}
                        </p>
                        <p className="text-[10px] font-medium text-[#5A5A6E] flex items-center gap-1">
                          <Clock size={10} /> {lesson.duration}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Player Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Top Header */}
        <div className="h-14 border-b border-[#e5e7eb] flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg text-[#5A5A6E]">
                <Menu size={20} />
              </button>
            )}
            <button onClick={() => router.back()} className="flex items-center gap-1 text-sm font-bold text-[#5A5A6E] hover:text-[#0A5C4A]">
              <ChevronLeft size={16} /> Back to Dashboard
            </button>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" size="sm" dot>Verified Course</Badge>
            <div className="h-4 w-px bg-gray-200 mx-1" />
            <span className="text-xs font-bold text-[#5A5A6E]">Rating: 4.9</span>
          </div>
        </div>

        {/* Video & Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Mock Video Player */}
          <div className="aspect-video bg-black relative flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black opacity-90" />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative z-10 w-20 h-20 rounded-full bg-[#0A5C4A] flex items-center justify-center text-white shadow-2xl cursor-pointer hover:scale-110 transition-transform"
            >
              <Play size={32} className="fill-current ml-1" />
            </motion.div>
            
            {/* Player Controls Mock */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center justify-between text-white mb-2">
                <span className="text-xs font-bold">12:45 / 32:00</span>
                <div className="flex gap-4">
                  <button className="hover:text-[#0A5C4A]"><Star size={16} /></button>
                  <button className="hover:text-[#0A5C4A] font-bold text-xs uppercase">CC</button>
                  <button className="hover:text-[#0A5C4A] font-bold text-xs uppercase">1.5x</button>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-[#0A5C4A] w-[40%]" />
              </div>
            </div>
          </div>

          {/* Lesson Details */}
          <div className="p-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h2 className="text-2xl font-black text-[#1E1E2A] mb-2">Custom Hooks Deep Dive</h2>
                <p className="text-[#5A5A6E] text-sm">Advanced Patterns • Section 2, Lesson 5</p>
              </div>
              <Button size="lg" className="h-12 px-8 shadow-primary">
                <CheckCircle2 size={18} className="mr-2" /> Mark as Completed
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#e5e7eb] mb-8">
              {(['content', 'resources', 'discussion'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-6 py-4 text-sm font-bold capitalize transition-all relative",
                    activeTab === tab ? "text-[#0A5C4A]" : "text-[#5A5A6E] hover:text-[#1E1E2A]"
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div layoutId="tabActive" className="absolute bottom-0 left-0 right-0 h-1 bg-[#0A5C4A] rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Panels */}
            <div className="min-h-[200px]">
              <AnimatePresence mode="wait">
                {activeTab === 'content' && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h3 className="font-bold text-[#1E1E2A]">About this lesson</h3>
                    <p className="text-sm text-[#5A5A6E] leading-relaxed">
                      In this lesson, we will explore the power of Custom Hooks to encapsulate complex 
                      logic and share it across multiple components. We'll build a real-world 
                      `useForm` hook and a `useLocalStorage` hook to understand the mechanics of 
                      state synchronization and side effects.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-8">
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0A5C4A] shadow-sm"><Play size={14} /></div>
                        <div>
                          <p className="text-[10px] font-black text-[#5A5A6E] uppercase">Type</p>
                          <p className="text-xs font-bold text-[#1E1E2A]">HD Video Lecture</p>
                        </div>
                      </div>
                      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0A5C4A] shadow-sm"><FileText size={14} /></div>
                        <div>
                          <p className="text-[10px] font-black text-[#5A5A6E] uppercase">Resource</p>
                          <p className="text-xs font-bold text-[#1E1E2A]">PDF Guide Included</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'resources' && (
                  <motion.div
                    key="resources"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    {[
                      { name: 'Custom Hooks Guide.pdf', size: '2.4 MB' },
                      { name: 'Starter Code (Zip)', size: '15.8 MB' },
                      { name: 'Lesson Transcripts.txt', size: '45 KB' },
                    ].map((res, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-[#e5e7eb] hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0A5C4A]/5 flex items-center justify-center text-[#0A5C4A]">
                            <Download size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1E1E2A]">{res.name}</p>
                            <p className="text-[10px] font-black text-[#9ca3af] uppercase">{res.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-[#0A5C4A] font-bold">Download</Button>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'discussion' && (
                  <motion.div
                    key="discussion"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                      <MessageSquare size={28} />
                    </div>
                    <h4 className="font-bold text-[#1E1E2A]">No discussions yet</h4>
                    <p className="text-sm text-[#5A5A6E] mt-1 mb-6">Be the first to ask a question about this lesson.</p>
                    <Button variant="outline" size="md">Start Discussion</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="h-16 border-t border-[#e5e7eb] flex items-center justify-between px-8 bg-white shrink-0">
          <button className="flex items-center gap-2 text-sm font-bold text-[#5A5A6E] hover:text-[#1E1E2A] transition-colors">
            <ChevronLeft size={18} /> Previous Lesson
          </button>
          <button className="flex items-center gap-2 text-sm font-bold text-[#0A5C4A] hover:opacity-80 transition-opacity">
            Next Lesson <ChevronRight size={18} />
          </button>
        </div>
      </main>
    </div>
  );
}
