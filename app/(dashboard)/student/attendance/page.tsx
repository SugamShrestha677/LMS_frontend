"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStudentAttendance } from '@/lib/hooks/useStudentData';
import { Card } from '@/components/ui/Card';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import { Badge } from '@/components/ui/Badge';
import { 
  Calendar, CheckCircle2, XCircle, Clock, 
  Search, BookOpen, AlertCircle, TrendingUp 
} from 'lucide-react';

type StudentAttendanceRecord = {
  id: number | string;
  courseName: string;
  sessionTitle: string;
  date: string;
  status: string;
};

export default function AttendancePage() {
  const { data: attendanceData, isLoading } = useStudentAttendance();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const records: StudentAttendanceRecord[] = Array.isArray(attendanceData) ? attendanceData : [];

  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const matchesSearch = 
        record.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.sessionTitle.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || record.status.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => r.status.toLowerCase() === 'present').length;
    const absent = records.filter(r => r.status.toLowerCase() === 'absent').length;
    const late = records.filter(r => r.status.toLowerCase() === 'late').length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    
    return { total, present, absent, late, rate };
  }, [records]);

  if (isLoading) return <DashboardSkeleton />;

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present': return <CheckCircle2 size={16} />;
      case 'absent': return <XCircle size={16} />;
      case 'late': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present': return 'success';
      case 'absent': return 'danger';
      case 'late': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="primary" size="sm" dot pulse>Live Tracking</Badge>
          </div>
          <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
            Attendance Record
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-2 font-medium">
            Track your participation and session history across all enrolled courses.
          </p>
        </motion.div>
      </div>

      {records.length > 0 ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="p-6 border-l-4 border-l-[#0A5C4A] bg-[#0A5C4A]/[0.02] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                <TrendingUp className="text-[#0A5C4A] mb-2" size={24} />
                <span className="text-3xl font-black text-[#0A5C4A]">{stats.rate}%</span>
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">Attendance Rate</span>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="p-6 border-l-4 border-l-green-500 bg-green-500/[0.02] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle2 className="text-green-500 mb-2" size={24} />
                <span className="text-3xl font-black text-green-600">{stats.present}</span>
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">Present</span>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="p-6 border-l-4 border-l-amber-500 bg-amber-500/[0.02] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                <Clock className="text-amber-500 mb-2" size={24} />
                <span className="text-3xl font-black text-amber-600">{stats.late}</span>
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">Late</span>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="p-6 border-l-4 border-l-red-500 bg-red-500/[0.02] flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md transition-shadow">
                <XCircle className="text-red-500 mb-2" size={24} />
                <span className="text-3xl font-black text-red-600">{stats.absent}</span>
                <span className="text-sm font-semibold text-[var(--color-text-secondary)] mt-1">Absent</span>
              </Card>
            </motion.div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] opacity-50" size={18} />
              <input
                type="text"
                placeholder="Search by course or session..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-bg-card)] text-[var(--color-text-primary)] text-sm font-medium focus:outline-none focus:border-[var(--color-primary)] transition-colors shadow-sm"
              />
            </div>
            
            <div className="flex items-center gap-2 bg-[var(--color-muted)] p-1.5 rounded-xl w-full md:w-auto overflow-x-auto">
              {['all', 'present', 'late', 'absent'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2 rounded-lg font-bold text-sm capitalize whitespace-nowrap transition-all ${
                    statusFilter === status
                      ? 'bg-[var(--color-bg-card)] shadow-sm text-[var(--color-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* List view */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record, idx) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="p-6 hover:shadow-xl transition-all duration-300 group overflow-hidden relative cursor-default border-t-4" style={{
                      borderTopColor: record.status.toLowerCase() === 'present' ? '#22c55e' :
                                      record.status.toLowerCase() === 'absent' ? '#ef4444' :
                                      record.status.toLowerCase() === 'late' ? '#f59e0b' : '#6b7280'
                    }}>
                      <div className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.06] transition-all duration-500 ${
                        record.status.toLowerCase() === 'present' ? 'bg-green-500' :
                        record.status.toLowerCase() === 'absent' ? 'bg-red-500' :
                        record.status.toLowerCase() === 'late' ? 'bg-amber-500' : 'bg-gray-500'
                      }`} />
                      
                      <div className="flex justify-between items-start mb-5 relative z-10">
                        <Badge variant={getStatusColor(record.status) as any} className="flex items-center gap-1.5 uppercase tracking-wide px-3 py-1 shadow-sm">
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                        <div className="flex items-center text-xs font-bold text-[var(--color-text-secondary)] bg-[var(--color-muted)] border border-[var(--color-border)] px-3 py-1.5 rounded-lg shadow-sm">
                          <Calendar size={12} className="mr-1.5 text-[var(--color-primary)]" />
                          {record.date}
                        </div>
                      </div>
                      
                      <div className="space-y-3 relative z-10">
                        <h3 className="font-black text-xl text-[var(--color-text-primary)] leading-tight group-hover:text-[var(--color-primary)] transition-colors">
                          {record.sessionTitle}
                        </h3>
                        <p className="text-sm font-semibold text-[var(--color-text-secondary)] flex items-center gap-2">
                          <BookOpen size={16} className="text-[#0A5C4A]/70" />
                          {record.courseName}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full py-16 text-center bg-[var(--color-muted)] rounded-2xl border-2 border-dashed border-[var(--color-border)]"
                >
                  <div className="w-16 h-16 bg-[var(--color-bg-card)] shadow-sm border border-[var(--color-border)] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="text-[var(--color-text-secondary)]" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)]">No matching records found</h3>
                  <p className="text-[var(--color-text-secondary)] mt-2">Try adjusting your search terms or status filters.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <Card className="p-20 text-center border-dashed border-2 bg-[var(--color-muted)]/50">
          <Calendar size={64} className="text-[var(--color-text-secondary)] mx-auto mb-6 opacity-30" />
          <h3 className="text-2xl font-black text-[var(--color-text-primary)] mb-3">No attendance history yet</h3>
          <p className="text-[var(--color-text-secondary)] font-medium max-w-md mx-auto text-lg leading-relaxed">
            Your attendance records will appear here once tutors start marking live-session attendance for your enrolled courses.
          </p>
        </Card>
      )}
    </div>
  );
}