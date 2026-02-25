import React from "react";
import Skeleton from "../../components/Skeleton";
import ErrorMessage from "../../components/ErrorMessage";

export default function UserSnapshot({ stats, loading, error, onRetry }) {
  const totalPoints = stats?.totalPoints ?? 185;
  const rank = stats?.globalRank ?? 0;
  const lastRace = stats?.lastRaceDelta ?? "0";
  return (
    <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
      <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
      <h3 className="text-2xl font-semibold mb-8 tracking-wide">Your Stats</h3>
      {error ? (
        <ErrorMessage
          message={error.message || "Failed to load stats."}
          onRetry={onRetry}
        />
      ) : loading ? (
        <div className="space-y-4 text-zinc-300">
          <div className="flex justify-between items-center">
            <span>Total Points</span>
            <Skeleton lines={1} lineClass="h-6 w-20 rounded bg-zinc-700/40" />
          </div>
          <div className="flex justify-between items-center">
            <span>Global Rank</span>
            <Skeleton lines={1} lineClass="h-6 w-20 rounded bg-zinc-700/40" />
          </div>
          <div className="flex justify-between items-center">
            <span>Last Race</span>
            <Skeleton lines={1} lineClass="h-6 w-20 rounded bg-zinc-700/40" />
          </div>
        </div>
      ) : (
        <div className="space-y-4 text-zinc-300">
          <div className="flex justify-between items-center">
            <span>Total Points</span>
            <span className="text-white font-bold text-lg">{totalPoints}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Global Rank</span>
            <span className="text-white font-bold text-lg">#{rank}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Last Race</span>
            <span className="text-emerald-400 font-bold text-lg">
              {lastRace}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
