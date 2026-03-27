import React from 'react';
import Skeleton  from '../Skeleton';

const LeaderboardRowSkeleton = ({ className = '' }) => (
  <div className={`flex justify-between items-center animate-pulse h-16 gap-6 ${className}`}>
    <div className="flex items-center gap-6 min-w-0">
      <Skeleton className="h-6 w-12" />
      <div className="flex items-center gap-3 min-w-0">
        <Skeleton className="w-10 h-10 rounded-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
    <Skeleton className="h-6 w-20" />
  </div>
);

export default LeaderboardRowSkeleton;

