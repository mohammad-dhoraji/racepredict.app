import React from 'react';
import ProfileHeaderSkeleton from './ProfileHeaderSkeleton';
import PerformanceSnapshotSkeleton from './PerformanceSnapshotSkeleton';
import RecentRacesSkeleton from './RecentRacesSkeleton';
import LeaderboardPreviewSkeleton from './LeaderboardPreviewSkeleton';
import UserSnapshotSkeleton from './UserSnapshotSkeleton';
import Skeleton from '../Skeleton';

const ProfileSkeleton = () => (
  <div className="space-y-10 max-w-5xl mx-auto">
    {/* ProfileHeader */}
    <ProfileHeaderSkeleton className="animate-pulse" />
    
    {/* PerformanceSnapshot */}
    <PerformanceSnapshotSkeleton className="animate-pulse" />
    
    {/* Snapshot Grid */}
    <div className="grid md:grid-cols-2 gap-8">
      <UserSnapshotSkeleton />
      <LeaderboardPreviewSkeleton className="space-y-3" />
    </div>
    
    {/* RecentRaces */}
    <RecentRacesSkeleton className="animate-pulse" />
    
    {/* Account section skeleton */}
    <div className="flex justify-between items-center h-24 animate-pulse">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-12 w-32 rounded-xl" />
    </div>
  </div>
);

export default ProfileSkeleton;

