import React from "react";
import Skeleton from "../../components/Skeleton";
import ErrorMessage from "../../components/ErrorMessage";

// items: [{ rank, name, points }]
export default function TopFivePreview({ items, loading, error, onViewFull, onRetry }) {
  console.log("Top 5:", items );
  const renderRows = () => {
    if (items && items.length) {
      return items.map((it, idx) => (
        <div key={idx} className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
          <span className="font-medium">#{it.rank} {it.name}</span>
          <span className="font-bold text-[#c1a362]">{it.points} pts</span>
        </div>
      ));
    }

    return (
      <>
        <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
          <span className="font-medium">#1 SpeedKing</span>
          <span className="font-bold text-[#c1a362]">210 pts</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
          <span className="font-medium">#2 PodiumPro</span>
          <span className="font-bold">198 pts</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
          <span className="font-medium">#3 FastF1</span>
          <span className="font-bold">190 pts</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
          <span className="font-medium">#4 RaceMaster</span>
          <span className="font-bold">187 pts</span>
        </div>
        <div className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
          <span className="font-medium">#5 You</span>
          <span className="font-bold">185 pts</span>
        </div>
      </>
    );
  };

  return (
    <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
      <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold tracking-wide">Top 5 Leaderboard</h3>
        <span className="text-sm text-zinc-400 cursor-pointer hover:text-[#c1a362] transition" onClick={onViewFull}>
          View Full →
        </span>
      </div>

      {error ? (
        <ErrorMessage message={error.message || "Failed to load leaderboard."} onRetry={onRetry} />
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg">
              <Skeleton lines={1} lineClass="h-4 w-40 rounded bg-zinc-700/40" />
              <Skeleton lines={1} lineClass="h-4 w-16 rounded bg-zinc-700/40" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">{renderRows()}</div>
      )}
    </div>
  );
}
