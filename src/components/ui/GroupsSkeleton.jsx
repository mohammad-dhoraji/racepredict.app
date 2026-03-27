import React from 'react';
import Skeleton from '../Skeleton';

const GroupsSkeleton = ({ className = '' }) => (
  <div className={`max-w-5xl mx-auto space-y-10 w-full animate-pulse ${className}`}>
    {/* Header */}
    <div className="space-y-2">
      <div className="h-12 w-80 bg-zinc-800/50 rounded-xl" />
      <div className="h-4 w-64 bg-zinc-800/30 rounded" />
    </div>

    {/* Groups Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
      {[...Array(3)].map((_, i) => (
        <div key={i}>
          <div className="h-6 w-40 mb-2 bg-zinc-800/50 rounded" />
          <div className="h-4 w-24 bg-zinc-800/30 rounded" />
        </div>
      ))}
    </div>

    {/* Actions */}
    <div>
      <div className="h-6 w-32 mb-6 bg-zinc-800/50 rounded" />
      <div className="flex flex-col md:flex-row gap-6">
        <div className="h-12 w-full md:w-48 bg-zinc-800/50 rounded-xl" />
        <div className="flex flex-col sm:flex-row w-full gap-3 md:w-auto">
          <div className="h-12 flex-1 bg-zinc-800/50 rounded-xl" />
          <div className="h-12 w-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default GroupsSkeleton;

