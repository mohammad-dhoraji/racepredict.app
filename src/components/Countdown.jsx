import React, { useEffect, useState } from "react";

function formatDiff(ms) {
  if (ms <= 0) return "Closed";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (days > 0) return `${days} Days ${hours} Hours`;
  if (hours > 0) return `${hours} Hours ${minutes} Minutes`;
  return `${minutes} Minutes`;
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
