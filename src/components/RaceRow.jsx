import React from "react";
import Countdown from "./Countdown";



const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function RaceRow({ race, index, isNext = false }) {
  if (!race) {
    return null;
  }

  const isUpcoming = race.race_state === "upcoming";
  const isLocked = race.race_state === "locked";
  const isCompleted = race.race_state === "results_ready" || race.race_state === "scored";
  const hasWinner = isCompleted && race.winner;

  const rowClass = `
    grid grid-cols-1 md:grid-cols-5 items-center gap-4 py-6 px-6 border-b border-border/50 
    transition-all duration-300 hover:bg-secondary/30 md:hover:scale-[1.02]
    ${isNext ? "border-t-4 border-primary bg-primary/10 shadow-lg shadow-primary/20 rounded-xl mt-8 mb-4 p-8" : ""}
    ${isLocked ? "opacity-75" : ""}
    ${isCompleted ? "opacity-90" : ""}
  `;

  const statusBadge = () => {
    if (isNext || isUpcoming) return <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/50">🟢 UPCOMING</span>;
    if (isLocked) return <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/50">🟡 LOCKED</span>;
    if (isCompleted && hasWinner) return <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-bold rounded-full border border-blue-500/50">🏆 {race.winner}</span>;
    return <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-bold rounded-full">COMPLETED</span>;
  };

  return (
    <div
      className={rowClass}
      aria-label={`Race ${race.round}: ${race.name}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Round */}
      <div className="font-f1 font-bold text-lg md:text-xl text-primary">
        R{race.round}
        {isNext && <span className="block text-sm font-mono text-primary/70">NEXT RACE</span>}
      </div>

      {/* Name */}
      <div className="md:col-span-2">
        <h4 className="font-f1 font-bold text-foreground md:text-lg">{race.name}</h4>
        {race.circuit_name && <p className="font-mono text-xs text-muted-foreground">{race.circuit_name}</p>}
      </div>

      {/* Date */}
      <div className="font-mono text-sm md:text-base text-foreground">
        {formatDate(race.date || race.race_date)}
        {isUpcoming && <Countdown target={race.lock_at || race.race_date} className="block text-primary font-semibold mt-1" />}
      </div>

      {/* Status */}
      <div className="justify-self-end md:justify-self-center">
        {statusBadge()}
      </div>

      {/* Winner */}
      <div className="font-mono text-sm text-right md:text-center text-foreground">
        {hasWinner ? race.winner : "–"}
      </div>
    </div>
  );
}
