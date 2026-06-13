'use client';

import { useQuery } from '@tanstack/react-query';
import { badgeService } from '@/lib/services/badgeService';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/Skeleton';
import { Award } from 'lucide-react';

interface Props {
  courseId: number | string;
}

export function CourseAvailableBadges({ courseId }: Props) {
  const { data: badges, isLoading } = useQuery({
    queryKey: ['course', courseId, 'badges'],
    queryFn: () => badgeService.getCourseAvailableBadges(courseId),
    enabled: !!courseId,
  });

  if (isLoading) {
    return (
      <div className="flex gap-4 p-4 bg-[var(--color-muted)] rounded-xl border border-[var(--color-border)]">
        <Skeleton className="w-12 h-12 rounded-full" />
        <Skeleton className="w-32 h-6 mt-3" />
      </div>
    );
  }

  if (!badges || badges.length === 0) {
    return null;
  }

  return (
    <div className="p-4 bg-[var(--color-muted)] rounded-xl border border-[var(--color-border)] mb-6">
      <h4 className="text-sm font-bold text-[var(--color-text-secondary)] mb-4 flex items-center gap-2 uppercase tracking-widest">
        <Award size={16} className="text-[var(--color-primary)]" />
        Available Badges for this Course
      </h4>
      <div className="flex flex-wrap gap-4">
        {badges.map((badge: any) => (
          <div key={badge.id} className="flex items-center gap-3 bg-[var(--color-bg-card)] p-2 rounded-lg border border-[var(--color-border)]">
            <div className="relative w-10 h-10">
              <Image 
                src={badge.image_url} 
                alt={badge.name} 
                fill 
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--color-text-primary)]">{badge.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
