'use client';

import { useMemo, useState } from 'react';
import { useEnrollments } from '@/lib/hooks/useCourses';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { Users, Search, Mail, ExternalLink, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TutorStudentsPage() {
  const { data: enrollmentsData, isLoading } = useEnrollments();
  const [searchTerm, setSearchTerm] = useState('');

  const enrollments = useMemo(() => {
    return Array.isArray(enrollmentsData) ? enrollmentsData : (enrollmentsData as any)?.data || [];
  }, [enrollmentsData]);

  // Extract unique students and their associated course data
  const students = useMemo(() => {
    const studentMap = new Map();
    
    enrollments.forEach((enrollment: any) => {
      const studentId = typeof enrollment.student === 'object' ? enrollment.student.id : enrollment.student;
      const studentName = typeof enrollment.student === 'object' 
        ? `${enrollment.student.first_name || ''} ${enrollment.student.last_name || ''}`.trim() || enrollment.student.email
        : `Student ID: ${studentId}`;
      const studentEmail = typeof enrollment.student === 'object' ? enrollment.student.email : '';
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          id: studentId,
          name: studentName,
          email: studentEmail,
          enrollments: [],
          totalProgress: 0,
        });
      }
      
      const s = studentMap.get(studentId);
      s.enrollments.push(enrollment);
      s.totalProgress += (enrollment.progress_percentage || 0);
    });

    // Calculate averages
    const result = Array.from(studentMap.values()).map(s => ({
      ...s,
      averageProgress: s.enrollments.length > 0 ? Math.round(s.totalProgress / s.enrollments.length) : 0
    }));

    return result;
  }, [enrollments]);

  const filteredStudents = students.filter(s => 
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[var(--color-bg-card)]/40 p-8 rounded-[2rem] border border-[var(--color-border)] shadow-xl backdrop-blur-md">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            My <span className="text-[var(--color-primary)]">Students</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Monitor progress and engagement of students across your courses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center gap-4 p-6 bg-[var(--color-bg-card)]/60 border-[var(--color-border)]">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-[var(--color-text-secondary)] uppercase tracking-widest">Total Students</p>
            <p className="text-2xl font-black text-[var(--color-text-primary)]">{students.length}</p>
          </div>
        </Card>
        <div className="md:col-span-2 relative">
          <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
          <input 
            type="text" 
            placeholder="Search students by name or email..."
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
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Student</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Courses Enrolled</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)]">Avg Progress</th>
                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-[var(--color-text-secondary)] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {isLoading ? (
                <tr><td colSpan={4} className="p-0"><TableSkeleton rows={5} /></td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center">
                    <p className="text-[var(--color-text-secondary)] font-medium">No students found.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredStudents.map((student: any, idx: number) => (
                    <motion.tr 
                      key={student.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-[var(--color-primary)]/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center font-bold uppercase">
                            {student.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--color-text-primary)]">{student.name}</span>
                            <span className="text-[10px] text-[var(--color-text-secondary)] font-medium flex items-center gap-1 mt-0.5">
                              <Mail size={10} /> {student.email || 'No email available'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          {student.enrollments.map((enr: any) => (
                            <Badge key={enr.id} variant="outline" className="w-fit text-[10px]">
                              {typeof enr.course === 'object' ? enr.course.title : `Course #${enr.course}`}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 max-w-[120px]">
                          <div className="flex-1 bg-[var(--color-border)] rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-[var(--color-primary)] transition-all duration-500"
                              style={{ width: `${student.averageProgress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[var(--color-text-secondary)]">{student.averageProgress}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button className="w-10 h-10 rounded-xl hover:bg-[var(--color-primary)]/10 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-all inline-flex items-center justify-center">
                          <ExternalLink size={18} />
                        </button>
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
