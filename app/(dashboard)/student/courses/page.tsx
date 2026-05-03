'use client';

import { useStudentCourses, useEnrolledCourses } from '@/lib/hooks/useStudentData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, BookOpen, Clock, Star, Play, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function StudentCourses() {
  const { data: allCourses, isLoading: loadingAll } = useStudentCourses();
  const { data: enrolledCourses, isLoading: loadingEnrolled } = useEnrolledCourses();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'enrolled'>('enrolled');

  const courses = activeTab === 'all' ? allCourses : enrolledCourses;
  const isLoading = activeTab === 'all' ? loadingAll : loadingEnrolled;

  const filteredCourses = courses?.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.instructor?.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? [];

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#1E1E2A]">Learning <span className="text-gradient">Hub</span></h1>
          <p className="text-[#5A5A6E] mt-1">Master new skills and earn verified badges.</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl border border-[#e5e7eb] shadow-sm">
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'enrolled' 
                ? 'bg-[#0A5C4A] text-white shadow-md' 
                : 'text-[#5A5A6E] hover:bg-gray-50'
            }`}
          >
            My Courses
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all ${
              activeTab === 'all' 
                ? 'bg-[#0A5C4A] text-white shadow-md' 
                : 'text-[#5A5A6E] hover:bg-gray-50'
            }`}
          >
            Browse All
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5A5A6E]" />
          <input
            type="text"
            placeholder="Search for courses, instructors, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#e5e7eb] focus:ring-2 focus:ring-[#0A5C4A] focus:border-transparent outline-none bg-white text-sm"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto h-[46px] bg-white">
          <Filter size={18} className="mr-2" /> Filters
        </Button>
      </div>

      {/* Course Grid */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-0 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-2 w-full" />
                </div>
              </Card>
            ))}
          </motion.div>
        ) : filteredCourses.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen size={32} className="text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-[#1E1E2A]">No courses found</h3>
            <p className="text-[#5A5A6E] mt-2">Try adjusting your search or filters.</p>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card hover className="p-0 overflow-hidden group">
                  {/* Thumbnail Placeholder */}
                  <div className="h-48 bg-gray-100 relative overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/shapes/svg?seed=${course.id}`} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <Badge variant="primary" size="sm" className="bg-[#0A5C4A]/90 text-white border-none shadow-lg">
                        {course.category ?? 'Tech'}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex -space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${course.id + i}`} alt="user" />
                          </div>
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-[#5A5A6E] uppercase tracking-wider">
                        +1.2k Students
                      </span>
                    </div>

                    <h3 className="font-bold text-[#1E1E2A] text-lg mb-2 line-clamp-1 group-hover:text-[#0A5C4A] transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-xs text-[#5A5A6E] mb-4 flex items-center gap-1.5 font-medium">
                      <Clock size={12} /> {course.duration ?? '12 Hours'} • {course.lessons_count ?? 24} Lessons
                    </p>

                    {activeTab === 'enrolled' ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#0A5C4A]">Progress</span>
                          <span className="font-black">{course.progress ?? 45}%</span>
                        </div>
                        <ProgressBar value={course.progress ?? 45} color="#0A5C4A" />
                        <Button fullWidth size="md" className="h-10">
                          <Play size={14} className="mr-2 fill-current" /> Continue
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star size={14} className="fill-current" />
                          <span className="text-sm font-black text-[#1E1E2A]">{course.rating ?? '4.8'}</span>
                        </div>
                        <Button size="sm" className="h-9 px-5">
                          Enroll Now
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
