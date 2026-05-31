"use client";

import { useStudentAttendance } from '@/lib/hooks/useStudentData';
import { Card } from '@/components/ui/Card';
import { Table, TableRow, TableCell } from '@/components/ui/Table';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

type StudentAttendanceRecord = {
  id: number | string;
  courseName: string;
  sessionTitle: string;
  date: string;
  status: string;
};

export default function AttendancePage() {
  const { data: attendanceData, isLoading } = useStudentAttendance();

  if (isLoading) return <DashboardSkeleton />;

  const records: StudentAttendanceRecord[] = Array.isArray(attendanceData) ? attendanceData : [];

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-4xl font-black text-(--color-text-primary) tracking-tight">
        Attendance Overview
      </h1>
      <Card className="p-8">
        {records.length > 0 ? (
          <Table>
            <thead>
              <tr>
                <th>Course</th>
                <th>Session</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.courseName}</TableCell>
                  <TableCell>{record.sessionTitle}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-(--color-bg-muted) px-3 py-1 text-xs font-bold uppercase tracking-wide text-(--color-text-primary)">
                      {record.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="rounded-2xl border border-dashed border-(--color-border) bg-(--color-bg-muted) p-8 text-center">
            <p className="text-lg font-bold text-(--color-text-primary)">No attendance history yet</p>
            <p className="mt-2 text-sm text-(--color-text-secondary)">
              Attendance will appear here once tutors mark live-session attendance for your enrolled courses.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}