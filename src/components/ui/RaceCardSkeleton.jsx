import React from 'react';
import Skeleton  from '../Skeleton';

const RaceCardSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    {/* Top row */}
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <Skeleton className="h-4 w-16" />
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-5 h-5 rounded-full" />
          <Skeleton className="h-7 w-32" />
        </div>
        <Skeleton className="h-3.5 w-24" />
      </div>
      <Skeleton className="h-6 w-20 self-start rounded-full" />
    </div>

    {/* Bottom row */}
    <div className="flex items-end justify-between pt-6">
      <Skeleton className="h-5 w-28" />
    </div>

    {/* Circuit outline placeholder */}
    <div className="pointer-events-none absolute bottom-3 right-3 h-16 w-24 bg-neutral-800/50 rounded" />
  </div>
);

export default RaceCardSkeleton;

