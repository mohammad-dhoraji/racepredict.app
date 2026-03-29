import React, { useEffect, useState } from "react";

function formatDiff(ms) {
  if (ms <= 0) return "Live";

  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / 86400);

  // 👉 If more than 24 hours → show only days
  if (days >= 1) {
    return `${days} day${days !== 1 ? "s" : ""}`;
  }

  // 👉 If within 24 hours → show full countdown
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${hours} : ${minutes} : ${seconds}`;
}

export default function Countdown({ target }) {
  const [text, setText] = useState(() => {
    if (!target) return "TBA";
    const t = new Date(target).getTime();
    if (Number.isNaN(t)) return "TBA";
    return formatDiff(t - Date.now());
  });

  useEffect(() => {
    if (!target) return undefined;
    const targetTime = new Date(target).getTime();
    if (Number.isNaN(targetTime)) return undefined;

    const tick = () => {
      const diff = targetTime - Date.now();
      setText(formatDiff(diff));
    };

    const id = setInterval(tick, 1000);
    // tick immediately to avoid initial 1s delay
    tick();
    return () => clearInterval(id);
  }, [target]);

  return <>{text}</>;
}
