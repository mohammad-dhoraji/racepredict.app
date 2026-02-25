import React from "react";

export default function Skeleton({ className = "", lines = 3, lineClass = "h-4 my-2 rounded bg-zinc-700/40" }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={lineClass} />
      ))}
    </div>
  );
}
