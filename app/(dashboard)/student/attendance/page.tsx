"use client";

import { useStudentAttendance } from '@/lib/hooks/useStudentData';
import { Card } from '@/components/ui/Card';
import { Table, TableRow, TableCell, AttendanceRecord } from '@/components/ui/Table';
import { DashboardSkeleton } from '@/components/ui/Skeleton';

export default function AttendancePage() {
  const { data: attendanceData, isLoading } = useStudentAttendance();

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 pb-12">
      <h1 className="text-4xl font-black text-[var(--color-text-primary)] tracking-tight">
        Attendance Overview
      </h1>
      <Card className="p-8">
        <Table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData?.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.courseName}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.status}</TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}