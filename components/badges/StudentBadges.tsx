'use client';

import { useQuery } from '@tanstack/react-query';
import { badgeService } from '@/lib/services/badgeService';
import { Card } from '@/components/ui/Card';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/Skeleton';
import { Award } from 'lucide-react';

export function StudentBadges() {
  const { data: badges, isLoading } = useQuery({
    queryKey: ['student', 'badges'],
    queryFn: badgeService.getStudentBadges,
  });

  if (isLoading) {
    return (
      <Card className="p-8">
        <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
          <Award className="text-amber-500" /> Earned Badges
        </h3>
        <div className="flex gap-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <Skeleton className="w-20 h-20 rounded-full" />
        </div>
      </Card>
    );
  }

  if (!badges || badges.length === 0) {
    return null; // Or show a placeholder
  }

  return (
    <Card className="p-8">
      <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-6 flex items-center gap-3">
        <Award className="text-amber-500" /> Earned Badges
      </h3>
      <div className="flex flex-wrap gap-6">
        {badges.map((sb: any) => (
          <div key={sb.id} className="group relative flex flex-col items-center">
            <div className="relative w-24 h-24 mb-2 shadow-lg rounded-full overflow-hidden border-2 border-[var(--color-primary)]">
              <Image 
                src={sb.badge.image_url} 
                alt={sb.badge.name} 
                fill 
                className="object-cover"
              />
            </div>
            <p className="text-sm font-bold text-center text-[var(--color-text-primary)]">
              {sb.badge.name}
            </p>
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-black text-white text-xs rounded shadow-xl z-10 text-center">
              {sb.badge.description}
              <br/>
              <span className="text-[10px] text-gray-300">Issued: {new Date(sb.issued_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
