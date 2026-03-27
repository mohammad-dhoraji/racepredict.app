import React from 'react';
import Skeleton  from '../Skeleton';

const LeaderboardPodiumSkeleton = ({ className = '' }) => (
  <div className={`w-full overflow-x-auto pb-12 pt-8 -mt-8 text-center whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden block animate-pulse ${className}`}>
    <div className="inline-flex items-end justify-center gap-4 md:gap-7 px-6 pt-10 mt-2 mx-auto text-left whitespace-normal align-top">
      {/* P3 */}
      <div className="shrink-0 w-35 md:w-42.5 h-55 md:h-[250px] bg-neutral-800/50 backdrop-blur-xl border border-border rounded-2xl shadow-xl" />
      {/* P1 */}
      <div className="shrink-0 w-35 md:w-42.5 h-65 md:h-[300px] bg-neutral-800/50 backdrop-blur-xl border border-primary/30 rounded-2xl shadow-2xl ring-2 ring-primary/30" />
      {/* P2 */}
      <div className="shrink-0 w-35 md:w-42.5 h-55 md:h-[250px] bg-neutral-800/50 backdrop-blur-xl border border-border rounded-2xl shadow-xl" />
    </div>
  </div>
);

export default LeaderboardPodiumSkeleton;

