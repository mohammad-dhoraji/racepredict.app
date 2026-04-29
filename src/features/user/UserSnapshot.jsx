import React from "react";
import ErrorMessage from "../../components/ErrorMessage";

function formatLastRaceScore(score) {
  if (score == null) return "-";
  return score > 0 ? `+${score}` : `${score}`;
}

export default function UserSnapshot({ stats, error, onRetry }) {
  if (error) {
    return (
      <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
        <ErrorMessage
          message={error.message || "Failed to load stats."}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
        <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
        <h3 className="text-2xl font-semibold mb-4 tracking-wide">Your Stats</h3>
        <p className="text-zinc-400">Stats are not available yet.</p>
      </div>
    );
  }

  const totalPoints = stats.totalPoints ?? 0;
  const rank = stats.globalRank == null ? "-" : `#${stats.globalRank}`;
  const lastRace = formatLastRaceScore(stats.lastRaceScore);

  return (
    <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
      <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
      <h3 className="text-2xl font-semibold mb-8 tracking-wide">Your Stats</h3>
      <div className="space-y-4 text-zinc-300">
        <div className="flex justify-between items-center">
          <span>Total Points</span>
          <span className="text-white font-bold text-lg">{totalPoints}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Global Rank</span>
          <span className="text-white font-bold text-lg">{rank}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Last Race</span>
          <span className="text-emerald-400 font-bold text-lg">
            {lastRace}
          </span>
        </div>
      </div>
    </div>
  );
}
