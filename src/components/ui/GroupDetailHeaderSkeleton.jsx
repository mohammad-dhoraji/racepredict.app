import React from 'react';

const GroupDetailHeaderSkeleton = ({ className = '' }) => (
  <div className={`animate-pulse ${className}`}>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
      <div className="min-w-0">
        <div className="h-12 w-64 mb-2 bg-zinc-800/50 rounded-xl" />
        <div className="flex items-center gap-2">
          <div className="h-4 w-20 bg-zinc-800/30 rounded" />
          <div className="w-8 h-8 bg-zinc-800/50 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto space-y-2 sm:space-y-0">
        <div className="h-10 w-64 rounded-xl bg-zinc-800/50" />
        <div className="h-10 w-32 px-4 rounded-xl bg-zinc-800/50" />
      </div>
    </div>
  </div>
);

export default GroupDetailHeaderSkeleton;

