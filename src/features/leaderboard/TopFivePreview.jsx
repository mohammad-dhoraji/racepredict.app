import React from "react";
import ErrorMessage from "../../components/ErrorMessage";

// items: [{ rank, name, points }]
export default function TopFivePreview({
  items,
  error,
  onViewFull,
  onRetry,
}) {
  const renderRows = () => {
    if (items?.length) {
      return items.map((entry, index) => (
        <div
          key={entry.rank || index}
          className="flex justify-between py-2 px-3 bg-zinc-800/30 rounded-lg"
        >
          <span className="font-medium">
            #{entry.rank} {entry.name}
          </span>
          <span className="font-bold text-[#c1a362]">{entry.points} pts</span>
        </div>
      ));
    }

    return <p className="text-zinc-400">Leaderboard data is not available yet.</p>;
  };

  return (
    <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-b-3xl p-10 shadow-2xl shadow-black/40">
      <div className="absolute -top-1 left-0 w-full h-0.75 bg-linear-to-r from-[#c1a362] via-red-500/60 to-[#c1a362] rounded-t-3xl" />
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-2xl font-semibold tracking-wide">Top 5 Leaderboard</h3>
        <span
          className="text-sm text-zinc-400 cursor-pointer hover:text-[#c1a362] transition"
          onClick={onViewFull}
        >
          View Full
        </span>
      </div>

      {error ? (
        <ErrorMessage
          message={error.message || "Failed to load leaderboard."}
          onRetry={onRetry}
        />
      ) : (
        <div className="space-y-3">{renderRows()}</div>
      )}
    </div>
  );
}
