import React from 'react';

const PerformanceSnapshotSkeleton = ({ className = '' }) => (
  <div className={`w-full h-64 animate-pulse overflow-hidden ${className}`}>
    <div className="relative h-full p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-48 bg-zinc-800/50 rounded-xl" />
        <div className="h-6 w-24 bg-zinc-800/30 rounded-lg" />
      </div>
      
      {/* Chart area */}
      <div className="grid grid-cols-2 h-40 gap-6 mb-6">
        <div className="space-y-4">
          <div className="h-2 w-full bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full" />
          <div className="h-2 w-11/12 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full" />
          <div className="h-2 w-3/4 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-full" />
        </div>
        <div className="space-y-4">
          <div className="h-3 w-full bg-zinc-800/50 rounded-lg" />
          <div className="h-3 w-5/6 bg-zinc-800/50 rounded-lg" />
          <div className="h-3 w-2/3 bg-zinc-800/50 rounded-lg" />
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-3 w-12 bg-zinc-700/50 rounded" />
          <div className="h-3 w-16 bg-zinc-700/50 rounded" />
        </div>
        <div className="h-10 w-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl" />
      </div>
    </div>
  </div>
);

export default PerformanceSnapshotSkeleton;

